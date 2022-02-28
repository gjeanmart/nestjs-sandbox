GCP_REGION := us-central1
GCP_PROJECT_ID := maquineta-staging
GCP_SERVICE_NAME := nextjs-sandbox-api
GCP_IMAGE_NAME := gcr.io/${GCP_PROJECT_ID}/${GCP_SERVICE_NAME}

# === Docker ===

docker/build:
	docker build --tag ${GCP_IMAGE_NAME} .

docker/push:
	docker push ${GCP_IMAGE_NAME}

docker/run:
	docker run \
		--tty \
		--interactive \
		--rm \
		--publish 3000:3000 \
		${GCP_IMAGE_NAME}

# === Google Cloud ===

cloud/deploy:
	gcloud run deploy ${GCP_SERVICE_NAME} \
		--image ${GCP_IMAGE_NAME} \
		--region ${GCP_REGION}
