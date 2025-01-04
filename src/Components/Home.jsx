import { doc, setDoc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { database } from "../Firebase/Setup";

function Home(props) {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  const addNews = async (data) => {
    const docRef = doc(database, "News", `${data.url.substr(-10, 10)}`);
    const docSnap = await getDoc(docRef);

    try {
      await setDoc(docRef, {
        title: data.title || "Untitled",
        description: data.description || "No description available"
      });
    } catch (err) {
      console.error("Error adding document:", err);
    }
  };

  const getNews = () => {
    const query = props.menu || "All";

    fetch(
      `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${
        import.meta.env.VITE_NEWS_API_KEY
      }`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((json) => {
        console.log(json);
        setNews(json.articles || []);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    getNews();
  }, [props.menu]);

  return (
    <div className="xl:mt-14 lg:mt-[4.5rem] md:mt-[6.5rem] xs:mt-[8rem] p-5 grid lg:grid-cols-4 gap-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1">
      {error ? (
        <div className="col-span-4 text-red-500 font-bold">
          Error: {error}. Please try again later.
        </div>
      ) : (
        news
          ?.filter((data) =>
            data.title.toLowerCase().includes(props.search.toLowerCase())
          )
          .map((data, index) => (
            <Link
              key={index}
              onClick={() => addNews(data)}
              to="/details"
              state={{ data: data }}
            >
              <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white h-[500px] ">
                <img
                  className="w-full h-48 object-cover"
                  src={data.urlToImage || "https://via.placeholder.com/400"}
                  alt={data.title || "News Image"}
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">
                    {data.title || "No Title Available"}
                  </div>
                  <p className="text-gray-700 text-base">
                    {data.content || "No content available."}
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
