import { IdeaCard } from "./idea-card";

interface Idea {
  rank: number;
  title: string;
  reasoning: {
    commentDemand: string;
    pastPerformance: string;
    audienceFit: string;
  };
  predictedEngagement: number;
  confidence: number;
}

interface IdeaListProps {
  ideas: Idea[];
}

export function IdeaList({ ideas }: IdeaListProps) {
  return (
    <div className="space-y-6">
      {ideas.map((idea, index) => (
        <IdeaCard key={index} idea={idea} index={index} />
      ))}
    </div>
  );
}