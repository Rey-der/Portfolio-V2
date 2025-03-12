🎨 Portfolio-V2

🚀 My personal portfolio website, built with React and Vite, showcasing my projects, skills, and experience.

    📢 Note: Lighthouse scores are near perfect for Accessibility, Best Practices, and SEO. Performance optimizations will be refined after adding more portfolio content (images, animations).

✨ Key Features

    🎭 Projects Showcase – Displays my projects with descriptions, technologies used, and links to live demos & repositories.
        🔄 3D Carousel with advanced scroll/swipe detection:
            Smooth, direction-aware animations
            Touch & trackpad optimized scrolling
            Consistent flick/swipe behavior for intuitive navigation
    🧑‍💻 About Me – Includes a unique "About Code" section styled like VS Code.
    🌍 Multi-Language Support – Expands accessibility to a wider audience.
    📩 Contact Form – Allows visitors to reach out easily.
    💬 Guestbook – A space for visitors to leave comments.
    📱 Responsive Design – Optimized for all screen sizes.
    🎬 Animations – Uses Framer Motion for fluid transitions.
    🚀 Progressive Loading – Enhances performance dynamically.
    🔗 Scroll-Based URL Updates – Adjusts the URL to reflect the section in view.
    🏗️ Dynamic Header/Footer – Route-based visibility for an immersive experience.

🛠️ Technologies Used

🔹 React – Component-based UI framework
🔹 Vite – Lightning-fast dev environment
🔹 Tailwind CSS – Utility-first styling
🔹 Framer Motion – Smooth animations
🔹 GitHub API – Fetches project data
⚡ Getting Started

    Install dependencies:

npm install

Run the development server:

    npm run dev

    📍 Opens at http://localhost:5173 (or a similar port).

📦 Building for Production

To create an optimized production build:

npm run build

This generates a minified build in the dist directory.
⚙️ Configuration

📝 Vite: Configurations in vite.config.js
🎨 Tailwind CSS: Custom styles in tailwind.config.js
🔑 Environment Variables: Store sensitive data in .env
🖼️ Layout Visibility: Controlled in MainLayout
📂 Data & API

📁 Data Storage:

    src/data – Houses project info, bio, and multilingual content.

📡 API Handling:

    src/api/github.js – Fetches GitHub activity.
    src/api/guestbook.js – Manages guestbook entries.

🔧 Custom Hooks

🌀 useSideScroll – Enables smooth touch & trackpad gestures for the interactive 3D carousel.
🤝 Contributing

🚀 Contributions are welcome! Feel free to open issues or submit pull requests.
📜 License

📝 MIT License – Free to use and modify!