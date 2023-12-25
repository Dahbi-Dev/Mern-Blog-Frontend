import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({ _id, title, summary, cover, content, createdAt, author }) {
  // Helper function to limit summary to a specific number of words
  const limitSummary = (text, wordCount) => {
    const words = text.split(' ');
    if (words.length > wordCount) {
      return words.slice(0, wordCount).join(' ') + '...';
    }
    return text;
  };

  // Helper function to limit the title to a specific number of words
  const limitTitle = (text, wordCount) => {
    const words = text.split(' ');
    if (words.length > wordCount) {
      return words.slice(0, wordCount).join(' ') + '...';
    }
    return text;
  };

  const limitedSummary = limitSummary(summary, 15);
  const limitedTitle = limitTitle(title, 8); // Adjust the word count as needed

  return (
    <div>
      <div className="post">
        <div className="image">
          <Link className='links' to={`/PostPage/${_id}`}>
            <img src={'http://localhost:3001/' + cover} alt="thumbnail" />
          </Link>
        </div>
        <div className="text">
          <Link className='links' to={`/PostPage/${_id}`}>
            <h2>{limitedTitle}</h2>
          </Link>
          <p className="info">
            <Link to={''} className="author">{author.username}</Link>
            <time>{format(new Date(createdAt), 'E-MM-yyyy hh:mm')}</time>
          </p>
          <p className="summary">
            {limitedSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
