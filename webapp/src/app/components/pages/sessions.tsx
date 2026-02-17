"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSessions } from "@/hooks/use-sessions";
import { Session } from "@/types/profile";
import Link from "next/link";
import { useState } from "react";

export type ClientSessionsPageProps = {
  serverSessions: Session[];
};

export default function ClientSessionsPage({
  serverSessions,
}: ClientSessionsPageProps) {
  const { sessions } = useSessions(serverSessions);
  const [sortBy, setSortBy] = useState<"recent" | "caller" | "callee">(
    "recent"
  );

  const sortedSessions = [...sessions].sort((a, b) => {
    if (sortBy === "recent") {
      return (b.expireAt || 0) - (a.expireAt || 0);
    }
    if (sortBy === "caller") {
      return (a.name || "").localeCompare(b.name || "");
    }
    if (sortBy === "callee") {
      return (a.calleeNumber || "").localeCompare(b.calleeNumber || "");
    }
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Call Sessions</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="sortBy" className="text-sm text-muted-foreground">
            Sort by:
          </Label>
          <Select
            value={sortBy}
            onValueChange={(value) =>
              setSortBy(value as "recent" | "caller" | "callee")
            }>
            <SelectTrigger id="sortBy" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="caller">Caller Name</SelectItem>
              <SelectItem value="callee">Callee Number</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No call sessions found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedSessions.map((session) => (
            <SessionCard key={session.connectionId} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left hover:bg-accent transition-colors">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-lg font-semibold">
                {session.name || "Unknown Caller"}
              </h3>
              <Badge
                className={
                  session.callStatus === "connected" ? "bg-green-500" : ""
                }
                variant={
                  session.callStatus === "connected" ? "default" : "secondary"
                }>
                {session.callStatus || "unknown"}
              </Badge>
              {session.whichParty && (
                <Badge variant="outline">{session.whichParty}</Badge>
              )}
              <Button
                variant="link"
                size="sm"
                asChild
                onClick={(e) => e.stopPropagation()}>
                <Link
                  href={`/conversations/${
                    session.parentConnectionId || session.connectionId
                  }`}>
                  View Conversation
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Connection ID</p>
                <p className="font-mono text-xs truncate">
                  {session.connectionId}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Call SID</p>
                <p className="font-mono text-xs truncate">
                  {session.callSid || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="ml-4 flex-shrink-0">
            <svg
              className={`w-5 h-5 text-muted-foreground transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {expanded && (
        <CardContent className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Caller (Source) Info */}
            <div>
              <h4 className="font-semibold mb-3">Caller Settings</h4>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Language</dt>
                  <dd>{session.sourceLanguageFriendly || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Voice</dt>
                  <dd>{session.sourceVoice || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Transcription</dt>
                  <dd>{session.sourceTranscriptionProvider || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">TTS Provider</dt>
                  <dd>{session.sourceTtsProvider || "N/A"}</dd>
                </div>
              </dl>
            </div>

            {/* Callee Info */}
            <div>
              <h4 className="font-semibold mb-3">Callee Settings</h4>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Number</dt>
                  <dd>{session.calleeNumber || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Language</dt>
                  <dd>{session.calleeLanguageFriendly || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Voice</dt>
                  <dd>{session.calleeVoice || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Transcription</dt>
                  <dd>{session.calleeTranscriptionProvider || "N/A"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
