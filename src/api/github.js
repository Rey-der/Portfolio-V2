import axios from 'axios';

const GITHUB_USERNAME = 'hyperion-mw'; // Replace with your actual GitHub username
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;
const GITHUB_REPOS_URL = `${GITHUB_API_URL}/repos`;
const GITHUB_EVENTS_URL = `${GITHUB_API_URL}/events`;

// Fetch basic GitHub user profile information
export const fetchGitHubProfile = async () => {
  try {
    const response = await axios.get(GITHUB_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    return null;
  }
};

// Fetch GitHub repositories
export const fetchGitHubProjects = async () => {
  try {
    const response = await axios.get(GITHUB_REPOS_URL + '?sort=updated&per_page=10');
    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return [];
  }
};

// Fetch GitHub user events/activity
export const fetchGitHubActivity = async () => {
  try {
    const response = await axios.get(GITHUB_EVENTS_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    return [];
  }
};

// Fetch contribution stats for visualization
export const fetchContributionStats = async () => {
  try {
    // Note: GitHub doesn't provide an official API for the contribution graph
    // This is a workaround to get some activity data we can visualize
    const [profile, repos, events] = await Promise.all([
      fetchGitHubProfile(),
      fetchGitHubProjects(),
      fetchGitHubActivity()
    ]);
    
    // Calculate stats from available data
    const stats = {
      totalRepos: profile.public_repos,
      totalCommits: events.filter(event => event.type === 'PushEvent')
        .reduce((total, event) => total + event.payload.commits?.length || 0, 0),
      languages: {},
      recentActivity: events.slice(0, 10),
      topRepos: repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5)
    };
    
    // Extract languages from repos
    repos.forEach(repo => {
      if (repo.language) {
        stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
      }
    });
    
    // Generate mock data for contribution grid (since GitHub API doesn't provide this)
    stats.contributionGrid = generateMockContributionGrid();
    
    return stats;
  } catch (error) {
    console.error('Error fetching contribution stats:', error);
    return null;
  }
};

// Helper function to generate mock contribution data
// This simulates GitHub's contribution grid with realistic patterns
function generateMockContributionGrid() {
  const weeks = 52;
  const daysPerWeek = 7;
  const grid = [];
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - (weeks * daysPerWeek));
  
  // Generate a realistic pattern with more recent contributions being higher on average
  for (let week = 0; week < weeks; week++) {
    const weekData = [];
    for (let day = 0; day < daysPerWeek; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (week * 7) + day);
      
      // More recent contributions are generally higher
      // Weekend contributions are generally lower
      const recencyFactor = Math.min(1, (week / weeks) * 2); // Higher for more recent weeks
      const weekendFactor = (day === 0 || day === 6) ? 0.3 : 1; // Lower for weekends
      const randomFactor = Math.random();
      
      // Calculate contribution level (0-4, like GitHub's levels)
      let level;
      const probability = recencyFactor * weekendFactor * randomFactor;
      
      if (probability < 0.5) level = 0;       // Empty
      else if (probability < 0.7) level = 1;  // Light
      else if (probability < 0.85) level = 2; // Medium
      else if (probability < 0.95) level = 3; // Medium-high
      else level = 4;                        // High
      
      weekData.push({
        date: date.toISOString().split('T')[0],
        count: level === 0 ? 0 : Math.floor(level * 3 + Math.random() * 5), // Convert level to count
        level
      });
    }
    grid.push(weekData);
  }
  
  return grid;
}