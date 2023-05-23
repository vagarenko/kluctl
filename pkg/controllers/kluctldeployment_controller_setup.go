package controllers

import (
	"context"
	"github.com/hashicorp/go-retryablehttp"
	kluctlv1 "github.com/kluctl/kluctl/v2/api/v1beta1"
	"github.com/kluctl/kluctl/v2/pkg/results"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/builder"
	"sigs.k8s.io/controller-runtime/pkg/predicate"
	"time"
)

// SetupWithManager sets up the controller with the Manager.
func (r *KluctlDeploymentReconciler) SetupWithManager(ctx context.Context, mgr ctrl.Manager, opts KluctlDeploymentReconcilerOpts) error {
	// Configure the retryable http client used for fetching artifacts.
	// By default it retries 10 times within a 3.5 minutes window.
	httpClient := retryablehttp.NewClient()
	httpClient.RetryWaitMin = 5 * time.Second
	httpClient.RetryWaitMax = 30 * time.Second
	httpClient.RetryMax = opts.HTTPRetry
	httpClient.Logger = nil
	r.httpClient = httpClient

	resultStore, err := results.NewResultStoreSecrets(ctx, mgr.GetClient(), mgr.GetCache(), "kluctl-results", 10)
	if err != nil {
		return err
	}
	r.ResultStore = resultStore

	return ctrl.NewControllerManagedBy(mgr).
		For(&kluctlv1.KluctlDeployment{}, builder.WithPredicates(
			predicate.Or(predicate.GenerationChangedPredicate{}, ReconcileRequestedPredicate{}, DeployRequestedPredicate{}),
		)).
		Complete(r)
}