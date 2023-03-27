/* Do not change, this code is generated from Golang structs */


export class DeploymentError {
    ref: ObjectRef;
    message: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.ref = this.convertValues(source["ref"], ObjectRef);
        this.message = source["message"];
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class Change {
    type: string;
    jsonPath: string;
    oldValue?: any;
    newValue?: any;
    unifiedDiff?: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.type = source["type"];
        this.jsonPath = source["jsonPath"];
        this.oldValue = source["oldValue"];
        this.newValue = source["newValue"];
        this.unifiedDiff = source["unifiedDiff"];
    }
}
export class ChangedObject {
    ref: ObjectRef;
    changes?: Change[];

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.ref = this.convertValues(source["ref"], ObjectRef);
        this.changes = this.convertValues(source["changes"], Change);
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class IgnoreForDiffItemConfig {
    fieldPath: string[];
    group?: string;
    kind?: string;
    name?: string;
    namespace?: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.fieldPath = source["fieldPath"];
        this.group = source["group"];
        this.kind = source["kind"];
        this.name = source["name"];
        this.namespace = source["namespace"];
    }
}
export class HelmChartConfig {
    repo?: string;
    path?: string;
    credentialsId?: string;
    chartName?: string;
    chartVersion?: string;
    updateConstraints?: string;
    releaseName: string;
    namespace?: string;
    output?: string;
    skipCRDs?: boolean;
    skipUpdate?: boolean;
    skipPrePull?: boolean;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.repo = source["repo"];
        this.path = source["path"];
        this.credentialsId = source["credentialsId"];
        this.chartName = source["chartName"];
        this.chartVersion = source["chartVersion"];
        this.updateConstraints = source["updateConstraints"];
        this.releaseName = source["releaseName"];
        this.namespace = source["namespace"];
        this.output = source["output"];
        this.skipCRDs = source["skipCRDs"];
        this.skipUpdate = source["skipUpdate"];
        this.skipPrePull = source["skipPrePull"];
    }
}
export class DeleteObjectItemConfig {
    group?: string;
    kind?: string;
    name: string;
    namespace?: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.group = source["group"];
        this.kind = source["kind"];
        this.name = source["name"];
        this.namespace = source["namespace"];
    }
}
export class GitProject {
    url: string;
    ref?: string;
    subDir?: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.url = source;
        this.ref = source["ref"];
        this.subDir = source["subDir"];
    }
}
export class DeploymentItemConfig {
    path?: string;
    include?: string;
    git?: GitProject;
    tags?: string[];
    barrier?: boolean;
    waitReadiness?: boolean;
    vars?: VarsSource[];
    skipDeleteIfTags?: boolean;
    onlyRender?: boolean;
    alwaysDeploy?: boolean;
    deleteObjects?: DeleteObjectItemConfig[];
    when?: string;
    renderedHelmChartConfig?: HelmChartConfig;
    renderedObjects?: ObjectRef[];
    renderedInclude?: DeploymentProjectConfig;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.path = source["path"];
        this.include = source["include"];
        this.git = this.convertValues(source["git"], GitProject);
        this.tags = source["tags"];
        this.barrier = source["barrier"];
        this.waitReadiness = source["waitReadiness"];
        this.vars = this.convertValues(source["vars"], VarsSource);
        this.skipDeleteIfTags = source["skipDeleteIfTags"];
        this.onlyRender = source["onlyRender"];
        this.alwaysDeploy = source["alwaysDeploy"];
        this.deleteObjects = this.convertValues(source["deleteObjects"], DeleteObjectItemConfig);
        this.when = source["when"];
        this.renderedHelmChartConfig = this.convertValues(source["renderedHelmChartConfig"], HelmChartConfig);
        this.renderedObjects = this.convertValues(source["renderedObjects"], ObjectRef);
        this.renderedInclude = this.convertValues(source["renderedInclude"], DeploymentProjectConfig);
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class SealedSecretsConfig {
    outputPattern?: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.outputPattern = source["outputPattern"];
    }
}
export class VarsSourceVault {
    address: string;
    path: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.address = source["address"];
        this.path = source["path"];
    }
}
export class VarsSourceAwsSecretsManager {
    secretName: string;
    region?: string;
    profile?: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.secretName = source["secretName"];
        this.region = source["region"];
        this.profile = source["profile"];
    }
}
export class Userinfo {


    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}
export class YamlUrl {
    Scheme: string;
    Opaque: string;
    User: Userinfo;
    Host: string;
    Path: string;
    RawPath: string;
    OmitHost: boolean;
    ForceQuery: boolean;
    RawQuery: string;
    Fragment: string;
    RawFragment: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.Scheme = source["Scheme"];
        this.Opaque = source["Opaque"];
        this.User = this.convertValues(source["User"], Userinfo);
        this.Host = source["Host"];
        this.Path = source["Path"];
        this.RawPath = source["RawPath"];
        this.OmitHost = source["OmitHost"];
        this.ForceQuery = source["ForceQuery"];
        this.RawQuery = source["RawQuery"];
        this.Fragment = source["Fragment"];
        this.RawFragment = source["RawFragment"];
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class VarsSourceHttp {
    url?: YamlUrl;
    method?: string;
    body?: string;
    headers?: {[key: string]: string};
    jsonPath?: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.url = this.convertValues(source["url"], YamlUrl);
        this.method = source["method"];
        this.body = source["body"];
        this.headers = source["headers"];
        this.jsonPath = source["jsonPath"];
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class VarsSourceClusterConfigMapOrSecret {
    name?: string;
    labels?: {[key: string]: string};
    namespace: string;
    key: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.name = source["name"];
        this.labels = source["labels"];
        this.namespace = source["namespace"];
        this.key = source["key"];
    }
}
export class VarsSourceGit {
    url: string;
    ref?: string;
    path: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.url = source;
        this.ref = source["ref"];
        this.path = source["path"];
    }
}
export class VarsSource {
    ignoreMissing?: boolean;
    noOverride?: boolean;
    values?: UnstructuredObject;
    file?: string;
    git?: VarsSourceGit;
    clusterConfigMap?: VarsSourceClusterConfigMapOrSecret;
    clusterSecret?: VarsSourceClusterConfigMapOrSecret;
    systemEnvVars?: UnstructuredObject;
    http?: VarsSourceHttp;
    awsSecretsManager?: VarsSourceAwsSecretsManager;
    vault?: VarsSourceVault;
    when?: string;
    renderedVars?: UnstructuredObject;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.ignoreMissing = source["ignoreMissing"];
        this.noOverride = source["noOverride"];
        this.values = this.convertValues(source["values"], UnstructuredObject);
        this.file = source["file"];
        this.git = this.convertValues(source["git"], VarsSourceGit);
        this.clusterConfigMap = this.convertValues(source["clusterConfigMap"], VarsSourceClusterConfigMapOrSecret);
        this.clusterSecret = this.convertValues(source["clusterSecret"], VarsSourceClusterConfigMapOrSecret);
        this.systemEnvVars = this.convertValues(source["systemEnvVars"], UnstructuredObject);
        this.http = this.convertValues(source["http"], VarsSourceHttp);
        this.awsSecretsManager = this.convertValues(source["awsSecretsManager"], VarsSourceAwsSecretsManager);
        this.vault = this.convertValues(source["vault"], VarsSourceVault);
        this.when = source["when"];
        this.renderedVars = this.convertValues(source["renderedVars"], UnstructuredObject);
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class DeploymentProjectConfig {
    vars?: VarsSource[];
    sealedSecrets?: SealedSecretsConfig;
    when?: string;
    deployments?: DeploymentItemConfig[];
    commonLabels?: {[key: string]: string};
    overrideNamespace?: string;
    tags?: string[];
    ignoreForDiff?: IgnoreForDiffItemConfig[];

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.vars = this.convertValues(source["vars"], VarsSource);
        this.sealedSecrets = this.convertValues(source["sealedSecrets"], SealedSecretsConfig);
        this.when = source["when"];
        this.deployments = this.convertValues(source["deployments"], DeploymentItemConfig);
        this.commonLabels = source["commonLabels"];
        this.overrideNamespace = source["overrideNamespace"];
        this.tags = source["tags"];
        this.ignoreForDiff = this.convertValues(source["ignoreForDiff"], IgnoreForDiffItemConfig);
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class ObjectRef {
    group: string;
    version: string;
    kind: string;
    name: string;
    namespace: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.group = source["group"];
        this.version = source["version"];
        this.kind = source["kind"];
        this.name = source["name"];
        this.namespace = source["namespace"];
    }
}
export class FixedImage {
    image: string;
    resultImage: string;
    deployedImage?: string;
    namespace?: string;
    object?: ObjectRef;
    deployment?: string;
    container?: string;
    deployTags?: string[];
    deploymentDir?: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.image = source["image"];
        this.resultImage = source["resultImage"];
        this.deployedImage = source["deployedImage"];
        this.namespace = source["namespace"];
        this.object = this.convertValues(source["object"], ObjectRef);
        this.deployment = source["deployment"];
        this.container = source["container"];
        this.deployTags = source["deployTags"];
        this.deploymentDir = source["deploymentDir"];
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class SealingConfig {
    args?: UnstructuredObject;
    secretSets?: string[];
    certFile?: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.args = this.convertValues(source["args"], UnstructuredObject);
        this.secretSets = source["secretSets"];
        this.certFile = source["certFile"];
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class UnstructuredObject {
    object?: any;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.object = source;
    }
}
export class Target {
    name: string;
    context?: string;
    args?: UnstructuredObject;
    sealingConfig?: SealingConfig;
    images?: FixedImage[];
    discriminator?: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.name = source["name"];
        this.context = source["context"];
        this.args = this.convertValues(source["args"], UnstructuredObject);
        this.sealingConfig = this.convertValues(source["sealingConfig"], SealingConfig);
        this.images = this.convertValues(source["images"], FixedImage);
        this.discriminator = source["discriminator"];
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class KluctlDeploymentInfo {
    name: string;
    namespace: string;
    gitUrl: string;
    gitRef: string;

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.name = source["name"];
        this.namespace = source["namespace"];
        this.gitUrl = source["gitUrl"];
        this.gitRef = source["gitRef"];
    }
}
export class CommandInfo {
    initiator: string;
    kluctlDeployment?: KluctlDeploymentInfo;
    command?: string;
    target?: Target;
    targetNameOverride?: string;
    contextOverride?: string;
    args?: UnstructuredObject;
    images?: FixedImage[];
    dryRun?: boolean;
    noWait?: boolean;
    forceApply?: boolean;
    replaceOnError?: boolean;
    forceReplaceOnError?: boolean;
    abortOnError?: boolean;
    includeTags?: string[];
    excludeTags?: string[];
    includeDeploymentDirs?: string[];
    excludeDeploymentDirs?: string[];

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.initiator = source["initiator"];
        this.kluctlDeployment = this.convertValues(source["kluctlDeployment"], KluctlDeploymentInfo);
        this.command = source["command"];
        this.target = this.convertValues(source["target"], Target);
        this.targetNameOverride = source["targetNameOverride"];
        this.contextOverride = source["contextOverride"];
        this.args = this.convertValues(source["args"], UnstructuredObject);
        this.images = this.convertValues(source["images"], FixedImage);
        this.dryRun = source["dryRun"];
        this.noWait = source["noWait"];
        this.forceApply = source["forceApply"];
        this.replaceOnError = source["replaceOnError"];
        this.forceReplaceOnError = source["forceReplaceOnError"];
        this.abortOnError = source["abortOnError"];
        this.includeTags = source["includeTags"];
        this.excludeTags = source["excludeTags"];
        this.includeDeploymentDirs = source["includeDeploymentDirs"];
        this.excludeDeploymentDirs = source["excludeDeploymentDirs"];
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class CommandResult {
    command?: CommandInfo;
    deployment?: DeploymentProjectConfig;
    renderedObjects?: UnstructuredObject[];
    newObjects?: UnstructuredObject[];
    changedObjects?: ChangedObject[];
    hookObjects?: UnstructuredObject[];
    orphanObjects?: ObjectRef[];
    deletedObjects?: ObjectRef[];
    errors?: DeploymentError[];
    warnings?: DeploymentError[];
    seenImages?: FixedImage[];

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.command = this.convertValues(source["command"], CommandInfo);
        this.deployment = this.convertValues(source["deployment"], DeploymentProjectConfig);
        this.renderedObjects = this.convertValues(source["renderedObjects"], UnstructuredObject);
        this.newObjects = this.convertValues(source["newObjects"], UnstructuredObject);
        this.changedObjects = this.convertValues(source["changedObjects"], ChangedObject);
        this.hookObjects = this.convertValues(source["hookObjects"], UnstructuredObject);
        this.orphanObjects = this.convertValues(source["orphanObjects"], ObjectRef);
        this.deletedObjects = this.convertValues(source["deletedObjects"], ObjectRef);
        this.errors = this.convertValues(source["errors"], DeploymentError);
        this.warnings = this.convertValues(source["warnings"], DeploymentError);
        this.seenImages = this.convertValues(source["seenImages"], FixedImage);
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}