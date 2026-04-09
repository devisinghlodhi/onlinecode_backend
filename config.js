const is_run_on_docker = process.env.EXECUTE_ON_DOCKER;
const EXECUTE_ON_DOCKER = (is_run_on_docker?.trim()?.toUpperCase() == "TRUE")

module.exports = EXECUTE_ON_DOCKER
