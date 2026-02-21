module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-bg-color': 'var(--primary-bg-color)',
        'secondary-bg-color': 'var(--secondary-bg-color)',
        'primary-accent-color': 'var(--primary-accent-color)',
        'secondary-accent-color': 'var(--secondary-accent-color)',
      },
    },
  },
  plugins: [],
};
