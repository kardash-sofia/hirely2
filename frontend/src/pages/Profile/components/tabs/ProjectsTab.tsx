import { type ProjectItemType } from "../../../Projects/components/ProjectItem";
import { HorizontalScroll } from "../../../../common/HorizontalScroll/HorizontalScroll";
import { ProjectCard } from "../items/ProjectCard";

export const ProjectsTab = ({ projects }: { projects: ProjectItemType[] }) => {
  return (
    <HorizontalScroll>
      {projects?.map((item) => (
        <ProjectCard key={item.id} item={item} />
      ))}
    </HorizontalScroll>
  );
};