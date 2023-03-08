import { prisma } from '../../lib/prisma';
  
export default async function postVote(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { id, voteType } = req.body;
  
    try {
      // Find the summary to update
      const summary = await prisma.page.findUnique({ where: { id } });
  
      if (!summary) {
        return res.status(404).json({ error: 'Summary not found' });
      }
  
      // Update the summary based on the vote type
      const updatedSummary =
        voteType === 'upvote'
          ? await prisma.page.update({
              where: { id },
              data: { upvotes: summary.upvotes + 1 },
            })
          : await prisma.page.update({
              where: { id },
              data: { downvotes: summary.downvotes + 1 },
            });
  
      // Return the updated summary
      res.status(200).json(updatedSummary);
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
}