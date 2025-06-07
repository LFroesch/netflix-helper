import { useEffect, useState } from "react"
import { useContentStore } from "../store/content.js";
import axios from "axios";

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState(null);
  const { contentType } = useContentStore();

  useEffect(() => {
    const getTrendingContent = async () => {
        setTrendingContent(null);
        const res = await axios.get(`/api/v1/${contentType}/trending`)
        setTrendingContent(res.data.content);
        console.log("Trending content:", res.data.content);
    }
    getTrendingContent();
  }, [contentType]);
    return { trendingContent };
}

export default useGetTrendingContent