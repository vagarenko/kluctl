import {CommandResult, ObjectRef, UnstructuredObject} from "./models";

const apiUrl = "/api"

export function listResults(): Promise<string[]> {
    let url = `${apiUrl}/listResults`
    return fetch(url)
        .then((response) => response.json());
}

export function getResult(resultId: string): Promise<CommandResult> {
    let url = `${apiUrl}/getResult?resultId=${resultId}`
    return fetch(url)
        .then(response => response.text())
        .then(json => {
            return new CommandResult(json)
        });
}

export function getRenderedObject(resultId: string, ref: ObjectRef): Promise<UnstructuredObject> {
    let url = `${apiUrl}/getRenderedObject?resultId=${resultId}&group=${ref.group}&version=${ref.version}&kind=${ref.kind}&name=${ref.name}&namespace=${ref.namespace}`
    return fetch(url)
        .then(response => new UnstructuredObject(response.json()))
}
