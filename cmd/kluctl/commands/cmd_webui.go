package commands

import (
	"context"
	"github.com/kluctl/kluctl/v2/pkg/types/result"
	"github.com/kluctl/kluctl/v2/pkg/webui"
	"github.com/kluctl/kluctl/v2/pkg/yaml"
)

type webuiCmd struct {
	File string `group:"misc" help:"TODO"`
	Port int    `group:"misc" help:"Port to serve the api and webui" default:"8080"`
}

func (cmd *webuiCmd) Help() string {
	return `TODO`
}

func (cmd *webuiCmd) Run(ctx context.Context) error {
	var commandResult *result.CommandResult
	err := yaml.ReadYamlFile(cmd.File, &commandResult)
	if err != nil {
		return err
	}

	source, err := webui.NewSimpleCommandResultsSource([]*result.CommandResult{commandResult})
	if err != nil {
		return err
	}
	server := webui.CommandResultsServer{
		CommandResultsSource: source,
	}

	return server.Run(ctx, cmd.Port)
}
