import React from "react";
import { useParams, useSearchParams } from "@/lib/router"; // Adjust path

const PostPage: React.FC = () => {
  const params = useParams(); // Gets { id: '...' }
  const searchParams = useSearchParams(); // Gets URLSearchParams object

  return (
    <div>
      <h1>Post Details</h1>
      <p>Post ID: {params.id}</p>
      <p>Search Params:</p>
      <ul>
        {Array.from(searchParams.entries()).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
      {searchParams.get("sort") && (
        <p>Sorting by: {searchParams.get("sort")}</p>
      )}
    </div>
  );
};

export default PostPage;
