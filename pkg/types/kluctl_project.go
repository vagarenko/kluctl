package types

import (
	"fmt"
	"github.com/codablock/kluctl/pkg/utils"
)

type DynamicArg struct {
	Name    string  `yaml:"name" validate:"required"`
	Pattern *string `yaml:"pattern,omitempty"`
}

type ExternalTargetConfig struct {
	Project *GitProject `yaml:"project,omitempty"`
	// Ref Branch/Tag to be used. Can't be combined with 'refPattern'. If 'branch' and 'branchPattern' are not used, 'branch' defaults to the default branch of targetConfig.project
	Ref *string `yaml:"ref,omitempty"`
	// RefPattern If set, multiple dynamic targets are created, each with 'ref' being set to the ref that matched the given pattern.
	RefPattern *string `yaml:"refPattern,omitempty"`
	// File defaults to 'target-config.yml'
	File *string `yaml:"file,omitempty"`
}

type SealingConfig struct {
	// DynamicSealing Set this to false if you want to disable sealing for every dynamic target
	DynamicSealing bool                   `yaml:"dynamicSealing,omitempty"`
	Args           map[string]interface{} `yaml:"args,omitempty"`
	SecretSets     []string               `yaml:"secretSets,omitempty"`
}

type Target struct {
	Name          string                 `yaml:"name" validate:"required"`
	Cluster       string                 `yaml:"cluster" validate:"required"`
	Args          map[string]interface{} `yaml:"args,omitempty"`
	DynamicArgs   []DynamicArg           `yaml:"dynamicArgs,omitempty"`
	TargetConfig  *ExternalTargetConfig  `yaml:"targetConfig"`
	SealingConfig SealingConfig          `yaml:"sealingConfig"`
	Images        []FixedImage           `yaml:"images,omitempty"`
}

type SecretSet struct {
	Name    string        `yaml:"name" validate:"required"`
	Sources []interface{} `yaml:"sources" validate:"required,gt=0,dive,required"`
}

type SecretsConfig struct {
	SecretSets []SecretSet `yaml:"secretSets,omitempty"`
}

type KluctlProject struct {
	Deployment    *ExternalProject `yaml:"deployment,omitempty"`
	SealedSecrets *ExternalProject `yaml:"sealedSecrets,omitempty"`
	Clusters      ExternalProjects `yaml:"clusters,omitempty"`
	Targets       []Target         `yaml:"targets,omitempty"`
	SecretsConfig *SecretsConfig   `yaml:"secretsConfig,omitempty"`
}

func LoadKluctlProjectConfig(p string, o *KluctlProject) error {
	err := utils.ReadYamlFile(p, o)
	if err != nil {
		return err
	}
	err = validate.Struct(o)
	if err != nil {
		return fmt.Errorf("validation for %v failed: %w", p, err)
	}
	return nil
}

func init() {
	validate.RegisterStructValidation(ValidateSecretSource, SecretSource{})
}