package result

import (
	"github.com/kluctl/kluctl/v2/pkg/types"
)

type CommandResultSummary struct {
	Id          string       `json:"id"`
	ProjectKey  ProjectKey   `json:"projectKey"`
	TargetKey   TargetKey    `json:"targetKey"`
	Target      types.Target `json:"target"`
	Command     CommandInfo  `json:"commandInfo"`
	GitInfo     GitInfo      `json:"gitInfo,omitempty"`
	ClusterInfo ClusterInfo  `json:"clusterInfo,omitempty"`

	RenderedObjects    int `json:"renderedObjects"`
	RemoteObjects      int `json:"remoteObjects"`
	AppliedObjects     int `json:"appliedObjects"`
	AppliedHookObjects int `json:"appliedHookObjects"`

	NewObjects     int `json:"newObjects"`
	ChangedObjects int `json:"changedObjects"`
	OrphanObjects  int `json:"orphanObjects"`
	DeletedObjects int `json:"deletedObjects"`

	Errors   []DeploymentError `json:"errors"`
	Warnings []DeploymentError `json:"warnings"`

	TotalChanges int `json:"totalChanges"`
}

func (cr *CommandResult) BuildSummary() *CommandResultSummary {
	if cr == nil {
		return nil
	}

	count := func(f func(o ResultObject) bool) int {
		cnt := 0
		for _, o := range cr.Objects {
			if f(o) {
				cnt++
			}
		}
		return cnt
	}

	ret := &CommandResultSummary{
		Id:                 cr.Id,
		ProjectKey:         cr.ProjectKey,
		TargetKey:          cr.TargetKey,
		Target:             cr.Target,
		Command:            cr.Command,
		GitInfo:            cr.GitInfo,
		ClusterInfo:        cr.ClusterInfo,
		RenderedObjects:    count(func(o ResultObject) bool { return o.Rendered != nil }),
		RemoteObjects:      count(func(o ResultObject) bool { return o.Remote != nil }),
		AppliedObjects:     count(func(o ResultObject) bool { return o.Applied != nil }),
		AppliedHookObjects: count(func(o ResultObject) bool { return o.Hook }),
		NewObjects:         count(func(o ResultObject) bool { return o.New }),
		ChangedObjects:     count(func(o ResultObject) bool { return len(o.Changes) != 0 }),
		OrphanObjects:      count(func(o ResultObject) bool { return o.Orphan }),
		DeletedObjects:     count(func(o ResultObject) bool { return o.Deleted }),
		Errors:             cr.Errors,
		Warnings:           cr.Warnings,
	}
	for _, o := range cr.Objects {
		ret.TotalChanges += len(o.Changes)
	}
	return ret
}
