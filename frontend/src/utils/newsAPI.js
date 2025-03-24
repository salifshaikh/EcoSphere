export const fetchEnvironmentalNews = async () => {
    try {
     
      const API_KEY = '9f80f1bc8ce141a19ebc372097c65692';
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=environment&apiKey=${API_KEY}&pageSize=12`
      );
      
      if (!response.ok) {
        throw new Error('News API request failed');
      }
      
      const data = await response.json();
      return data.articles;
    } catch (error) {
      console.error('Error fetching environmental news:', error);
      return [
        {
          title: "API Error: Could not fetch environmental news",
          description: "Please check your API key and connection. This is a placeholder.",
          urlToImage: "https://via.placeholder.com/300",
        }
      ];
    }
  };