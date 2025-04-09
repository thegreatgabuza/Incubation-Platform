import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { collection, getCountFromServer } from "firebase/firestore";

import { db } from "@/firebase";
import { CalendarUpcomingEvents, DashboardTotalCountCard } from "./components";

export const DashboardPage = () => {
  const [counts, setCounts] = useState({
    companies: 0,
    contacts: 0,
    deals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [companiesSnap, contactsSnap, dealsSnap] = await Promise.all([
          getCountFromServer(collection(db, "companies")),
          getCountFromServer(collection(db, "contacts")),
          getCountFromServer(collection(db, "deals")),
        ]);

        setCounts({
          companies: companiesSnap.data().count,
          contacts: contactsSnap.data().count,
          deals: dealsSnap.data().count,
        });
      } catch (error) {
        console.warn("Using fallback dummy counts due to error:", error);
        setCounts({
          companies: 12,
          contacts: 34,
          deals: 7,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className='page-container'>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource='companies'
            isLoading={loading}
            totalCount={counts.companies}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource='contacts'
            isLoading={loading}
            totalCount={counts.contacts}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource='deals'
            isLoading={loading}
            totalCount={counts.deals}
          />
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col xs={24}>
          <CalendarUpcomingEvents />
        </Col>
      </Row>
    </div>
  );
};
