'use strict';

function checkBranchPolicy({ EVENT_NAME, BASE_BRANCH, HEAD_BRANCH, HEAD_REPOSITORY, REPOSITORY }) {
  if (EVENT_NAME !== 'pull_request' || BASE_BRANCH !== 'main') {
    return;
  }

  if (HEAD_BRANCH !== 'development' || !REPOSITORY || HEAD_REPOSITORY !== REPOSITORY) {
    throw new Error(
      'Los cambios hacia main deben llegar mediante un PR desde development del mismo repositorio. ' +
      'Primero integra y valida tu rama de trabajo en development.',
    );
  }
}

module.exports = { checkBranchPolicy };

if (require.main === module) {
  try {
    checkBranchPolicy(process.env);
    console.log('Flujo de ramas correcto. Las aprobaciones se exigen mediante rulesets de GitHub.');
  } catch (error) {
    console.error(`::error::${error.message}`);
    process.exitCode = 1;
  }
}
