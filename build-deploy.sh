#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define variables
DOCKER_IMAGE_NAME="data-scraper:dev"
K8S_MANIFESTS_DIR="kubernetes"
NAMESPACE="default"

# Function to build the Docker image
build_docker_image() {
  echo "Building Docker image..."
  docker build -t $DOCKER_IMAGE_NAME .
}

# Function to start Minikube
start_minikube() {
  echo "Starting Minikube..."
  minikube start
}

# Function to use Minikube's Docker daemon
use_minikube_docker_daemon() {
  echo "Setting Docker environment to use Minikube's Docker daemon..."
  eval $(minikube docker-env)
}

# Function to deploy PostgreSQL to Kubernetes
deploy_postgresql() {
  echo "Deploying PostgreSQL to Kubernetes..."
  kubectl apply -f $K8S_MANIFESTS_DIR/postgres-deployment.yaml
  kubectl apply -f $K8S_MANIFESTS_DIR/postgres-service.yaml

  # Wait for PostgreSQL to be ready
  echo "Waiting for PostgreSQL to be ready..."
  kubectl wait --for=condition=available --timeout=120s deployment/postgres -n $NAMESPACE
}

# Function to deploy the application to Kubernetes
deploy_application() {
  echo "Deploying application to Kubernetes..."
  kubectl apply -f $K8S_MANIFESTS_DIR/data-scraper-deployment.yaml
  kubectl apply -f $K8S_MANIFESTS_DIR/data-scraper-service.yaml
}

# Function to wait for the application to be ready
wait_for_application() {
  echo "Waiting for application to be ready..."
  kubectl rollout status deployment/data-scraper -n $NAMESPACE
}

# Function to get the application URL
get_application_url() {
  echo "Fetching application URL..."
  minikube service data-scraper-service --url
}

# Main script execution
main() {
  start_minikube
  use_minikube_docker_daemon
  build_docker_image
  deploy_postgresql
  deploy_application
  wait_for_application
  APP_URL=$(get_application_url)
  echo "Application is running at: $APP_URL"
}

# Run the main function
main
