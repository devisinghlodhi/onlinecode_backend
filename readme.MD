
<!-- #############################  Run Main Application in Docker  ####################### -->


docker buildx build --load -t my-node-app .

docker run -d -p 5000:5000 --name node-container my-node-app





<!-- ############################   Run Code Environment to run code    ###################### -->
# Build using custom Dockerfile
docker buildx build --load -t multi-lang -f dockerfile.coderunner .

# Run container with custom name
docker run -d --name code-runner multi-lang



<!-- To clear docker data -->
docker system prune -a --volumes -f