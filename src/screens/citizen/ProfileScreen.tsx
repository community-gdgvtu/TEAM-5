import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { NavScreenProps } from "../../navigation/types";

/** Edit profile, payment methods, saved locations. */
export const ProfileScreen: React.FC<NavScreenProps> = () => {
  const user = {
    name: "Ananya Sharma",
    email: "ananya@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    role: "citizen",
  };

  return (
    <ScreenShell title="Profile" subtitle="Account & settings" role="citizen">
      <Card>
        <div className="p-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: "#22c55e" }} />
            <div>
              <h4 className="font-medium text-slate-100">{user.name}</h4>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-medium text-slate-200">Phone</p>
            <p className="text-sm text-slate-300">{user.phone}</p>
          </div>
          <div>
            <p className="font-medium text-slate-200">Location</p>
            <p className="text-sm text-slate-300">{user.location}</p>
          </div>
        </div>

        <div className="mt-4">
          <Button color="citizen" onClick={() => window.alert("Edit profile clicked")}>Edit Profile</Button>
          <Button color="citizen" variant="ghost" onClick={() => window.history.back()}>← Back</Button>
        </div>
      </Card>
    </ScreenShell>
  );
};

export default ProfileScreen;