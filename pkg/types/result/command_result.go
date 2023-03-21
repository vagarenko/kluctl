package result

import (
	"github.com/kluctl/kluctl/v2/pkg/types"
	"github.com/kluctl/kluctl/v2/pkg/types/k8s"
	"github.com/kluctl/kluctl/v2/pkg/utils/uo"
)

type Change struct {
	Type        string      `yaml:"type" validate:"required"`
	JsonPath    string      `yaml:"jsonPath" validate:"required"`
	OldValue    interface{} `yaml:"oldValue,omitempty"`
	NewValue    interface{} `yaml:"newValue,omitempty"`
	UnifiedDiff string      `yaml:"unifiedDiff,omitempty"`
}

type ChangedObject struct {
	Ref     k8s.ObjectRef `yaml:"ref"`
	Changes []Change      `yaml:"changes,omitempty"`
}

type RefAndObject struct {
	Ref    k8s.ObjectRef          `yaml:"ref"`
	Object *uo.UnstructuredObject `yaml:"object,omitempty"`
}

type DeploymentError struct {
	Ref   k8s.ObjectRef `yaml:"ref"`
	Error string        `yaml:"error"`
}

type KluctlDeploymentInfo struct {
	Name      string `yaml:"name"`
	Namespace string `yaml:"namespace"`
	GitUrl    string `yaml:"gitUrl"`
	GitRef    string `yaml:"gitRef"`
}

type CommandInitiator string

const (
	CommandInititiator_CommandLine      CommandInitiator = "CommandLine"
	CommandInititiator_KluctlDeployment                  = "KluctlDeployment"
)

type CommandInfo struct {
	Initiator             CommandInitiator       `yaml:"initiator" validate:"oneof=CommandLine KluctlDeployment"`
	KluctlDeployment      *KluctlDeploymentInfo  `yaml:"kluctlDeployment,omitempty"`
	Command               string                 `yaml:"command,omitempty"`
	Target                *types.Target          `yaml:"target,omitempty"`
	TargetNameOverride    string                 `yaml:"targetNameOverride,omitempty"`
	ContextOverride       string                 `yaml:"contextOverride,omitempty"`
	Args                  *uo.UnstructuredObject `yaml:"args,omitempty"`
	Images                []types.FixedImage     `yaml:"images,omitempty"`
	DryRun                bool                   `yaml:"dryRun,omitempty"`
	NoWait                bool                   `yaml:"noWait,omitempty"`
	ForceApply            bool                   `yaml:"forceApply,omitempty"`
	ReplaceOnError        bool                   `yaml:"replaceOnError,omitempty"`
	ForceReplaceOnError   bool                   `yaml:"forceReplaceOnError,omitempty"`
	AbortOnError          bool                   `yaml:"abortOnError,omitempty"`
	IncludeTags           []string               `yaml:"includeTags,omitempty"`
	ExcludeTags           []string               `yaml:"excludeTags,omitempty"`
	IncludeDeploymentDirs []string               `yaml:"includeDeploymentDirs,omitempty"`
	ExcludeDeploymentDirs []string               `yaml:"excludeDeploymentDirs,omitempty"`
}

type CommandResult struct {
	Command    *CommandInfo                   `yaml:"command,omitempty"`
	Deployment *types.DeploymentProjectConfig `yaml:"deployment,omitempty"`

	NewObjects     []*RefAndObject    `yaml:"newObjects,omitempty"`
	ChangedObjects []*ChangedObject   `yaml:"changedObjects,omitempty"`
	HookObjects    []*RefAndObject    `yaml:"hookObjects,omitempty"`
	OrphanObjects  []k8s.ObjectRef    `yaml:"orphanObjects,omitempty"`
	DeletedObjects []k8s.ObjectRef    `yaml:"deletedObjects,omitempty"`
	Errors         []DeploymentError  `yaml:"errors,omitempty"`
	Warnings       []DeploymentError  `yaml:"warnings,omitempty"`
	SeenImages     []types.FixedImage `yaml:"seenImages,omitempty"`
}

type ValidateResultEntry struct {
	Ref        k8s.ObjectRef `yaml:"ref"`
	Annotation string        `yaml:"annotation"`
	Message    string        `yaml:"message"`
}

type ValidateResult struct {
	Ready    bool                  `yaml:"ready"`
	Warnings []DeploymentError     `yaml:"warnings,omitempty"`
	Errors   []DeploymentError     `yaml:"errors,omitempty"`
	Results  []ValidateResultEntry `yaml:"results,omitempty"`
}
