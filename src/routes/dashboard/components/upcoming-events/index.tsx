import React, { useEffect, useState } from "react";
import { CalendarOutlined } from "@ant-design/icons";
import { Badge, Card, List, Skeleton as AntdSkeleton } from "antd";
import dayjs from "dayjs";

import { Text } from "@/components";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/firebase";

export const CalendarUpcomingEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(
          collection(db, "events"),
          where("startDate", ">=", dayjs().format("YYYY-MM-DD")),
          orderBy("startDate", "asc"),
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(data);
      } catch (error) {
        console.warn("Using fallback events due to error:", error);
        setEvents([
          {
            id: "1",
            title: "Funding Application Deadline",
            startDate: dayjs().add(1, "day").toISOString(),
            endDate: dayjs().add(1, "day").add(2, "hour").toISOString(),
            color: "blue",
          },
          {
            id: "2",
            title: "Mentor Check-In",
            startDate: dayjs().add(2, "day").toISOString(),
            endDate: dayjs().add(2, "day").add(1, "hour").toISOString(),
            color: "green",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Card
      style={{ height: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "0 1rem" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarOutlined />
          <Text size='sm' style={{ marginLeft: ".7rem" }}>
            Upcoming events
          </Text>
        </div>
      }
    >
      {loading ? (
        <List
          itemLayout='horizontal'
          dataSource={Array.from({ length: 5 }).map((_, index) => ({
            id: index,
          }))}
          renderItem={() => (
            <List.Item>
              <List.Item.Meta
                avatar={<Badge color='transparent' />}
                title={
                  <AntdSkeleton.Button active style={{ height: "14px" }} />
                }
                description={
                  <AntdSkeleton.Button
                    active
                    style={{ width: "300px", marginTop: "8px", height: "16px" }}
                  />
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <List
          itemLayout='horizontal'
          dataSource={events}
          renderItem={(item) => {
            const renderDate = () => {
              const start = dayjs(item.startDate).format(
                "MMM DD, YYYY - HH:mm",
              );
              const end = dayjs(item.endDate).format("MMM DD, YYYY - HH:mm");
              return `${start} - ${end}`;
            };

            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color={item.color} />}
                  title={<Text size='xs'>{renderDate()}</Text>}
                  description={
                    <Text ellipsis={{ tooltip: true }} strong>
                      {item.title}
                    </Text>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}

      {!loading && events.length === 0 && <NoEvent />}
    </Card>
  );
};

const NoEvent = () => (
  <span
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "220px",
    }}
  >
   
  </span>
);
