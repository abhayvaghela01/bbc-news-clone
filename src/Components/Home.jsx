import { doc, setDoc, getDoc } from "firebase/firestore";
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { database } from "../Firebase/Setup";

function Home(props) {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  const addNews = async (data) => {
    if (!data.link) return;

    const docRef = doc(database, "News", `${data.link.substr(-10, 10)}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      try {
        await setDoc(docRef, {
          title: data.title || "Untitled",
          description: data.snippet || "No description available"
        });
      } catch (err) {
        console.error("Error adding document:", err);
      }
    }
  };

  const getNews = () => {
    const query = props.menu || "All";
    const cachedData = sessionStorage.getItem(query);

    if (cachedData) {
      setNews(JSON.parse(cachedData));
      return;
    }

    const url = `https://real-time-news-data.p.rapidapi.com/search?query=${query}&limit=24`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "147f87332dmsh3aa7548d27a4998p1ec887jsn812dce987720",
        "x-rapidapi-host": "real-time-news-data.p.rapidapi.com",
        "Content-Type": "application/json",
        "Accept": "application/json",

      }
    };

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((json) => {
        const articles = json.data || [];
        console.log(articles);
        sessionStorage.setItem(query, JSON.stringify(articles));
        setNews(articles);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      getNews();
    }, 500);

    return () => clearTimeout(timeout);
  }, [props.menu]);

  const filteredNews = useMemo(() => {
    return news.filter((data) =>
      data.title.toLowerCase().includes(props.search.toLowerCase())
    );
  }, [news, props.search]);

  return (
    <div className="xl:mt-14 lg:mt-[4.5rem] md:mt-[6.5rem] xs:mt-[8rem] p-5 grid lg:grid-cols-4 gap-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1">
      {error ? (
        <div className="col-span-4 text-red-500 font-bold">
          Error: {error}. Please try again later.
        </div>
      ) : (
        filteredNews.map((data, index) => (
          <Link
            key={index}
            onClick={() => addNews(data)}
            to="/details"
            state={{ data: data }}
          >
            <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white h-[500px] ">
              <img
                className="w-full h-48 object-cover"
                src={
                  data.photo_url ||
                  "https://via.placeholder.com/400?text=No+Image+Available"
                }
                alt={data.title || "News Image"}
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                  {data.title || "No Title Available"}
                </div>
                <p className="text-gray-700 text-base">
                  {data.snippet || "No snippet available."}
                </p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default Home;
