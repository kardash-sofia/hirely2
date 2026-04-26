import { UserPreviewLink } from "../../../common/UserPreviewLink/UserPreviewLink";

export const OwnerInfo = ({
  owner,
}: {
  owner: { id: string; fullName: string; avatar?: string; email?: string };
}) => {
  return <UserPreviewLink user={owner} dense />;
};
