package webui

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"github.com/kluctl/kluctl/v2/pkg/types/k8s"
	"github.com/kluctl/kluctl/v2/pkg/utils/uo"
	"github.com/kluctl/kluctl/v2/pkg/yaml"
	log "github.com/sirupsen/logrus"
	"net"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kluctl/kluctl/v2/pkg/types/result"
)

type CommandResultsSource interface {
	ListCommandResultIds() ([]string, error)
	GetCommandResult(id string) (*SplittedCommandResult, error)
}

type SplittedCommandResult struct {
	OrigResult    *result.CommandResult
	ReducedResult result.CommandResult

	RenderedObjects map[k8s.ObjectRef]*uo.UnstructuredObject
	NewObjects      map[k8s.ObjectRef]*uo.UnstructuredObject
	ChangedObjects  map[k8s.ObjectRef]*result.ChangedObject
	HookObjects     map[k8s.ObjectRef]*uo.UnstructuredObject
}

func splitCommandResult(r *result.CommandResult) (string, *SplittedCommandResult, error) {
	h := sha256.New()
	err := yaml.WriteYamlStream(h, r)
	if err != nil {
		return "", nil, err
	}
	hs := hex.EncodeToString(h.Sum(nil))

	sr := &SplittedCommandResult{
		OrigResult:      r,
		ReducedResult:   *r,
		RenderedObjects: map[k8s.ObjectRef]*uo.UnstructuredObject{},
		NewObjects:      map[k8s.ObjectRef]*uo.UnstructuredObject{},
		ChangedObjects:  map[k8s.ObjectRef]*result.ChangedObject{},
		HookObjects:     map[k8s.ObjectRef]*uo.UnstructuredObject{},
	}
	sr.ReducedResult.RenderedObjects = nil
	sr.ReducedResult.NewObjects = nil
	sr.ReducedResult.ChangedObjects = nil
	sr.ReducedResult.HookObjects = nil

	for _, o := range r.RenderedObjects {
		sr.RenderedObjects[o.GetK8sRef()] = o
	}
	for _, o := range r.NewObjects {
		sr.NewObjects[o.GetK8sRef()] = o
	}
	for _, o := range r.ChangedObjects {
		sr.ChangedObjects[o.Ref] = o
	}
	for _, o := range r.HookObjects {
		sr.HookObjects[o.GetK8sRef()] = o
	}

	return hs, sr, nil
}

type SimpleCommandResultsSource struct {
	results map[string]*SplittedCommandResult
}

func NewSimpleCommandResultsSource(l []*result.CommandResult) (*SimpleCommandResultsSource, error) {
	ret := &SimpleCommandResultsSource{
		results: map[string]*SplittedCommandResult{},
	}
	for _, r := range l {
		hs, sr, err := splitCommandResult(r)
		if err != nil {
			return nil, err
		}
		ret.results[hs] = sr
		log.Infof("resultId: %s", hs)
	}
	return ret, nil
}

func (s *SimpleCommandResultsSource) ListCommandResultIds() ([]string, error) {
	ret := make([]string, 0, len(s.results))
	for id, _ := range s.results {
		ret = append(ret, id)
	}
	return ret, nil
}

func (s *SimpleCommandResultsSource) GetCommandResult(id string) (*SplittedCommandResult, error) {
	return s.results[id], nil
}

type CommandResultsServer struct {
	CommandResultsSource CommandResultsSource
}

func (s *CommandResultsServer) Run(ctx context.Context, port int) error {
	router := gin.Default()

	router.StaticFS("/webui", http.FS(uiFS))

	api := router.Group("/api")
	api.GET("/listResults", s.listResults)
	api.GET("/getResult", s.getResult)
	api.GET("/getRenderedObject", func(c *gin.Context) {
		s.getObject(c, "rendered")
	})
	api.GET("/getNewObject", func(c *gin.Context) {
		s.getObject(c, "rendered")
	})
	api.GET("/getChangedObject", func(c *gin.Context) {
		s.getObject(c, "changed")
	})
	api.GET("/getHookObject", func(c *gin.Context) {
		s.getObject(c, "hook")
	})

	address := fmt.Sprintf(":%d", port)
	listener, err := net.Listen("tcp", address)
	if err != nil {
		return err
	}

	httpServer := http.Server{
		Addr: address,
		BaseContext: func(listener net.Listener) context.Context {
			return ctx
		},
		Handler: router.Handler(),
	}

	return httpServer.Serve(listener)
}

func (s *CommandResultsServer) listResults(c *gin.Context) {
	ids, err := s.CommandResultsSource.ListCommandResultIds()
	if err != nil {
		_ = c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, ids)
}

type resultIdParam struct {
	ResultId string `form:"resultId"`
}
type refParam struct {
	Group     string `form:"group"`
	Version   string `form:"version"`
	Kind      string `form:"kind"`
	Name      string `form:"name"`
	Namespace string `form:"namespace"`
}

func (ref refParam) toK8sRef() k8s.ObjectRef {
	return k8s.ObjectRef{
		Group:     ref.Group,
		Version:   ref.Version,
		Kind:      ref.Kind,
		Name:      ref.Name,
		Namespace: ref.Namespace,
	}
}

func (s *CommandResultsServer) getResult(c *gin.Context) {
	var params resultIdParam

	err := c.Bind(&params)
	if err != nil {
		_ = c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	sr, err := s.CommandResultsSource.GetCommandResult(params.ResultId)
	if err != nil {
		_ = c.AbortWithError(http.StatusBadRequest, err)
		return
	}
	if sr == nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	c.JSON(http.StatusOK, sr.ReducedResult)
}

func (s *CommandResultsServer) getObject(c *gin.Context, objectType string) {
	var params resultIdParam
	var ref refParam

	err := c.Bind(&params)
	if err != nil {
		_ = c.AbortWithError(http.StatusBadRequest, err)
		return
	}
	err = c.Bind(&ref)
	if err != nil {
		_ = c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	sr, err := s.CommandResultsSource.GetCommandResult(params.ResultId)
	if err != nil {
		_ = c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	if sr == nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	var o any
	switch objectType {
	case "rendered":
		o = sr.RenderedObjects[ref.toK8sRef()]
	case "new":
		o = sr.NewObjects[ref.toK8sRef()]
	case "changed":
		o = sr.ChangedObjects[ref.toK8sRef()]
	case "hook":
		o = sr.HookObjects[ref.toK8sRef()]
	}
	if o == nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	c.JSON(http.StatusOK, o)
}
