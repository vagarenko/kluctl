package main

import (
	git_url "github.com/kluctl/kluctl/v2/pkg/git/git-url"
	"github.com/kluctl/kluctl/v2/pkg/types/result"
	"github.com/tkrajina/typescriptify-golang-structs/typescriptify"
)

func main() {
	converter := typescriptify.New().
		Add(result.CommandResult{}).
		ManageType(git_url.GitUrl{}, typescriptify.TypeOptions{TSType: "string", TSTransform: "source"})

	err := converter.ConvertToFile("ui/src/models.ts")
	if err != nil {
		panic(err.Error())
	}
}
