import { errorMessage } from "@/core/domain/errors";
import { Banner } from "../Banner";
import { EmptyState } from "../EmptyState";
import { Loading } from "../Loading";

interface ListStateProps {
  isPending: boolean;
  error: unknown;
  isEmpty: boolean;
  emptyMessage: string;
  onRetry?: () => void;
}

export function ListState({ isPending, error, isEmpty, emptyMessage, onRetry }: ListStateProps) {
  if (isPending) return <Loading inline />;
  if (error) return <Banner message={errorMessage(error)} onAction={onRetry} />;
  if (isEmpty) return <EmptyState message={emptyMessage} />;
  return null;
}
