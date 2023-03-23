package main

import (
	"github.com/kluctl/kluctl/v2/pkg/types/result"
	"github.com/tkrajina/typescriptify-golang-structs/typescriptify"
)

func main() {
	converter := typescriptify.New().
		Add(result.CommandResult{})

	err := converter.ConvertToFile("ui/src/models.ts")
	if err != nil {
		panic(err.Error())
	}
}
