import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosClient from "../clint";

interface Blog {
  id: string;
  title: string;
  author: {
    name: string;
  };
  createdAt: string;
  imageUrl: string;
  date: string; 
}

const Right = () => {
  const [picks, setPicks] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStaffPicks = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/blog/bulk");
        const staffPicks: Blog[] = response.data.data.slice(0, 3).map((post: Blog) => ({
          ...post,
          date: new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        }));
        setPicks(staffPicks);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to load staff picks");
      } finally {
        setLoading(false);
      }
    };

    fetchStaffPicks();
  }, []);

  const displayPicks = picks.length > 0 ? picks : [
    {
      id: "7",
      title: "Our Souls Need Proof of Work",
      author: { name: "Julie Zhuo" },
      date: "Mar 10",
      imageUrl: "https://via.placeholder.com/40"
    },
    {
      id: "8",
      title: "You're Not a Criminal, But You're Going to Jail: My ICE Detention Story as a Canadian Citizen",
      author: { name: "Jasmine Mooney" },
      date: "Mar 19",
      imageUrl: "https://via.placeholder.com/40"
    },
    {
      id: "9",
      title: "What Game Theory Can Tell Us About Tariffs",
      author: { name: "Laurel W" },
      date: "Feb 8",
      imageUrl: "https://via.placeholder.com/40"
    }
  ];

  return (
    <div className="sticky mx-auto p-4 bg-black rounded-lg shadow-lg text-gray-300 border border-gray-700 right-4 top-20">
      <h2 className="text-lg font-semibold mb-4">Staff Picks</h2>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <ul>
          {displayPicks.map((pick) => (
            <li key={pick.id} className="mb-4 flex items-start">
              <img
                src={pick.imageUrl || "https://via.placeholder.com/40"}
                alt={pick.author.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="text-sm font-semibold text-gray-300">{pick.author.name}</p>
                <Link to={`/blog/${pick.id}`}>
                  <p className="text-md font-bold text-white hover:underline cursor-pointer">
                    {pick.title}
                  </p>
                </Link>
                <p className="text-sm text-gray-400">{pick.date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link to="/blog">
        <p className="text-blue-400 text-sm cursor-pointer mt-2 hover:underline">
          See the full list
        </p>
      </Link>
    </div>
  );
};

export default Right;