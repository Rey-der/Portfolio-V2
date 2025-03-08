import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com/users/YOUR_GITHUB_USERNAME/repos';

export const fetchGitHubProjects = async () => {
    try {
        const response = await axios.get(GITHUB_API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        // Return empty array instead of throwing
        return [];
    }
};

export const fetchGitHubCommits = async (repo) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/YOUR_GITHUB_USERNAME/${repo}/commits`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching commits for ${repo}:`, error);
        throw error;
    }
};