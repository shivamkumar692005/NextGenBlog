interface BlogCardProps {
  id: string;
  author: string;
  title: string;
  description: string;
  date: string;
  views: string;
  comments: number;
  category: string;
  image: string;
  onClick: () => void;
}

export function BlogCard({ author, title, description, date, views, comments, image, onClick}: BlogCardProps) {
  return (
    <div className="flex items-start border-b border-gray-800 pb-6 cursor-pointer" onClick={onClick}>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{author}</p>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-400">{description}</p>
        <div className="flex items-center space-x-3 text-gray-500 text-sm mt-2">
          <span>⭐ {date}</span>
          <span>👀 {views}</span>
          <span>💬 {comments}</span>
        </div>
      </div>
      <img src={image} alt="Blog Thumbnail" className="w-24 h-24 object-cover rounded-lg ml-6" />
    </div>
  );
}
