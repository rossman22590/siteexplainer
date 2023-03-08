import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface VoteButtonProps {
  postId: string;
  isUpvote: boolean;
  voteCount: number;
  userVote: number;
  onVote: (newVote: number) => void;
}

const VoteButton: React.FC<VoteButtonProps> = ({
  postId,
  isUpvote,
  voteCount,
  userVote,
  onVote,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleVote = async (): Promise<void> => {
    setLoading(true);
    const ipAddress = router.asPath.split('/')[2];
    try {
      const response = await axios.post('/api/vote', {
        postId,
        isUpvote,
        ipAddress,
      });
      const newVote = response.data.newVote;
      onVote(newVote);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  let buttonLabel = '';
  let buttonColor = '';
  if (userVote === 1 && isUpvote) {
    buttonLabel = 'Upvoted';
    buttonColor = 'bg-green-500';
  } else if (userVote === -1 && !isUpvote) {
    buttonLabel = 'Downvoted';
    buttonColor = 'bg-red-500';
  } else {
    buttonLabel = isUpvote ? 'Upvote' : 'Downvote';
    buttonColor = 'bg-gray-400';
  }

  return (
    <button
      className={`px-2 py-1 rounded-lg ${buttonColor}`}
      disabled={loading || userVote !== 0}
      onClick={handleVote}
    >
      {buttonLabel} ({voteCount})
    </button>
  );
};

export default VoteButton;
