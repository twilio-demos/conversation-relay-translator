import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { HeroBanner } from "@/components/HeroBanner";
import { listProfiles, listSessions } from "@/lib/dynamodb";
import Link from "next/link";


export const dynamic = "force-dynamic";

export default async function Home() {
  const profiles = await listProfiles();
  const sessions = await listSessions();

  const previewProfiles = profiles.slice(0, 3);
  const previewSessions = sessions
    .sort((a, b) => (b.expireAt || 0) - (a.expireAt || 0))
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <HeroBanner />

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">User Profiles</h2>
          <div className="flex gap-3">
            <Button asChild size="sm">
              <Link href="/profiles/new">+ New Profile</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/profiles">View All</Link>
            </Button>
          </div>
        </div>

        {previewProfiles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No profiles found. Create your first profile to get started.
              </p>
              <Button asChild>
                <Link href="/profiles/new">Create Profile</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {previewProfiles.map((profile: any) => (
              <Link
                key={profile.phoneNumber}
                href={`/profiles/${encodeURIComponent(profile.phoneNumber)}`}
                className="block transition-shadow hover:shadow-lg">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                    <CardDescription>{profile.phoneNumber}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">
                          Caller: {profile.sourceLanguageFriendly}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Callee: {profile.calleeLanguageFriendly}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Call Sessions</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/sessions">View All</Link>
          </Button>
        </div>

        {previewSessions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No call sessions found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {previewSessions.map((session: any) => (
              <Card key={session.connectionId}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold">
                          {session.name || "Unknown Caller"}
                        </h3>
                        <Badge
                          variant={
                            session.callStatus === "connected"
                              ? "default"
                              : "secondary"
                          }>
                          {session.callStatus || "unknown"}
                        </Badge>
                        {session.whichParty && (
                          <Badge variant="outline">{session.whichParty}</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Connection ID</p>
                          <p className="font-mono text-xs truncate">
                            {session.connectionId}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Callee Number</p>
                          <p className="text-xs">
                            {session.calleeNumber || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button asChild size="sm" className="ml-4">
                      <Link
                        href={`/conversations/${
                          session.parentConnectionId || session.connectionId
                        }`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
