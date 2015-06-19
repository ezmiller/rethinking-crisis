deploy-staging:
	docpad generate --env staging
	rsync -avz --progress out/ rethinkingcrisis:staging/
