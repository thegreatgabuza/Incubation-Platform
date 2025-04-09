import React, { useEffect, useState } from "react";
import { Card, List, Skeleton as AntdSkeleton, Space } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit as limitFn,
} from "firebase/firestore";
import dayjs from "dayjs";

import { db } from "@/firebase";
import { CustomAvatar, Text } from "@/components";

type Props = { limit?: number };

export const DashboardLatestActivities = ({ limit = 5 }: Props) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesQuery = query(
          collection(db, "audits"),
          orderBy("createdAt", "desc"),
          limitFn(limit),
        );
        const snapshot = await getDocs(activitiesQuery);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivities(data);
      } catch (error) {
        console.warn("Using fallback dummy activities due to error:", error);
        setActivities([
          {
            id: 1,
            user: { name: "John Doe" },
            action: "CREATE",
            target: { title: "Business Plan Submission", stage: "Review" },
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            user: { name: "Jane Smith" },
            action: "UPDATE",
            target: { title: "Pitch Deck Upload", stage: "Approved" },
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [limit]);

  return (
    <Card
      headStyle={{ padding: "16px" }}
      bodyStyle={{ padding: "0 1rem" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UnorderedListOutlined />
          <Text size='sm' style={{ marginLeft: ".5rem" }}>
            Latest activities
          </Text>
        </div>
      }
    >
      {loading ? (
        <List
          itemLayout='horizontal'
          dataSource={Array.from({ length: limit }).map((_, index) => ({
            id: index,
          }))}
          renderItem={(_, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={
                  <AntdSkeleton.Avatar
                    active
                    size={48}
                    shape='square'
                    style={{ borderRadius: "4px" }}
                  />
                }
                title={
                  <AntdSkeleton.Button active style={{ height: "16px" }} />
                }
                description={
                  <AntdSkeleton.Button
                    active
                    style={{ width: "300px", height: "16px" }}
                  />
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <List
          itemLayout='horizontal'
          dataSource={activities}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={
                  <CustomAvatar
                    shape='square'
                    size={48}
                    name={item.user?.name}
                  />
                }
                title={dayjs(item.createdAt).format("MMM DD, YYYY - HH:mm")}
                description={
                  <Space size={4}>
                    <Text strong>{item.user?.name}</Text>
                    <Text>
                      {item.action === "CREATE" ? "created" : "updated"}
                    </Text>
                    <Text strong>{item.target?.title}</Text>
                    <Text>in stage</Text>
                    <Text strong>{item.target?.stage || "Unassigned"}</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};
