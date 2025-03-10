# Portfolio-V2

This is my personal portfolio website, built with React and Vite. It showcases my projects, skills, and experience.

## Key Features

*   **Projects Showcase:** Displays my projects with descriptions, technologies used, and links to live demos and GitHub repositories.
*   **About Me:** Provides information about my background, skills, and experience. Includes a unique "About Code" section with a VS Code-like interface.
*   **Multi-Language Support:** Supports multiple languages to reach a wider audience.
*   **Contact Form:** Allows visitors to easily contact.
*   **Guestbook:** A section for visitors to leave comments.
*   **Responsive Design:** Fully responsive and optimized for different screen sizes.
*   **Animations:** Uses Framer Motion for smooth transitions and engaging animations.
*   **Progressive Loading:** Implements progressive loading for improved performance.
*   **Scroll-Based URL Updates:** Updates the URL based on the current section in view.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool and development server.
*   **Tailwind CSS:** A utility-first CSS framework.
*   **Framer Motion:** A library for creating animations.
*   **GitHub API:** Fetches project data from GitHub.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone [your_repository_url]
    cd [your_repository_name]
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This will start the development server at `http://localhost:5173` (or a similar port).

## Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `dist` directory.

## Configuration

*   **Vite:** Configuration is located in `vite.config.js`.
*   **Tailwind CSS:** Configuration is located in `tailwind.config.js`.
*   **Environment Variables:** Create a `.env` file in the root directory to store sensitive information such as API keys.

## Data

Project data, about information, and UI text are stored in JavaScript files within the `src/data` directory. These data files are structured to support multiple languages.

## API

*   `src/api/github.js`: Fetches project data from GitHub.
*   `src/api/guestbook.js`: Handles guestbook entries.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

[MIT License]