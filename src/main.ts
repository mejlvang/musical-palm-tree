const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Application mount element was not found.');
}

app.textContent = 'McSquishy: Blob on the Run';
