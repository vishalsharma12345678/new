import * as React from "react";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DatePicker } from "antd";
import { NavLink } from "react-router-dom";
import { Sidebark } from "../Sidebar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";
const { RangePicker } = DatePicker;
export function UpcomingFragment({ user }) {
  const dt = useRef(null);
  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };
  const [rooms, setRooms] = useState([]);

  const [isFetching, setFetching] = useState(false);

  async function handleEdit(e, id, currentbookingid) {
    setFetching(true);
    const ids = {
      bookingid: id,
      roomsid: currentbookingid,
    };
    // console.log(ids)
    let roomsdata = await axios.post(
      `https://walrus-app-4kyov.ondigitalocean.app/book/updateBooking`,
      ids
    );
    await fetchData();

    setFetching(false);
  }

  async function handleEdit1(e, id) {
    // setFetching(true);
    const ids = {
      bookingid: id,
      value: e.target.value,
    };
    // console.log(ids)
    let roomsdata = await axios.post(
      `https://walrus-app-4kyov.ondigitalocean.app/book/updateBookingEntry`,
      ids
    );
    fetchData();

    // setFetching(false);
  }
  async function DeleteRoom(id) {
    // setFetching(true);
    await axios.get(
      `https://walrus-app-4kyov.ondigitalocean.app/book/deletebooking/${id}`
    );
    fetchData();
    // setFetching(false);
  }
  async function fetchData() {
    setFetching(true);
    let roomsdata = await fetch(
      "https://walrus-app-4kyov.ondigitalocean.app/book/allBookings"
    );
    let data = await roomsdata.json();
    console.log(data);
    setRooms(data.Upcomingbooking);
    setFetching(false);
  }
  useEffect(() => {
    fetchData();
  }, []);
  async function filterByDate(dates) {
    if (dates) {
      let rooms = await axios.post(
        "https://walrus-app-4kyov.ondigitalocean.app/book/allBookingswithdate",
        {
          check_in: dates[0],
          check_out: dates[1],
        }
      );
      console.log(dates);
      console.log(dates[0] + " " + dates[1]);
      console.log(rooms);
      setRooms(rooms.data.Upcomingbooking);
    } else {
      fetchData();
    }
  }
  const statusBodyTemplate = (product) => {
    return (
      <select
        name="status"
        disabled={
          product.check_in_check_out !== "Checkedin" ||
          product.status !== "booked"
            ? false
            : true
        }
        onChange={(e) => handleEdit1(e, product._id)}
      >
        <option
          value="Checkedin"
          selected={product.check_in_check_out === "Checkedin"}
        >
          CheckedIn
        </option>
        <option
          value="Checkedout"
          selected={product.check_in_check_out === "Checkedout"}
        >
          CheckedOut
        </option>
        <option
          value="waiting to checkin"
          disabled
          selected={product.check_in_check_out === "waiting to checkin"}
        >
          Waiting to checkIn
        </option>
      </select>
    );
  };
  const Booking_status = (product) => {
    return (
      <select
        name="status"
        disabled={
          product.status !== "booked" ||
          product.check_in_check_out === "Checkedin" ||
          product.check_in_check_out === "Checkedout"
            ? true
            : false
        }
        onChange={(e) => handleEdit(e, product._id, product.currentbooking)}
      >
        <option value="" selected={product.status === "booked"}>
          Booked
        </option>
        <option value="" selected={product.status !== "booked"}>
          Canceled
        </option>
      </select>
    );
  };
  const Action = (product) => {
    return (
      <>
        <NavLink to={`/EditRoom/${product._id}`}>
          <button
            disabled={
              product.check_in_check_out === "Checkedout" ||
              product.status !== "booked"
                ? true
                : false
            }
            style={{
              cursor: `${
                product.status !== "booked" ||
                product.check_in_check_out === "Checkedout"
                  ? "not-allowed"
                  : ""
              }`,
            }}
          >
            Edit
          </button>
        </NavLink>
        {user.isAdmin === "Admin" ? (
          <button onClick={() => DeleteRoom(product._id)}>Delete</button>
        ) : (
          ""
        )}
      </>
    );
  };
  return (
    <div style={{ display: "flex" }}>
      <Sidebark user={user} />
      <div
        className="rooms1 book1"
        style={{ position: "relative", left: "20%" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Room Booking Status</h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <RangePicker
              style={{ height: "38px" }}
              onChange={filterByDate}
              format="DD-MM-YYYY"
              className="m-2"
            />
          </div>
        </div>
        <button
          type="button"
          icon="pi pi-file"
          rounded
          onClick={() => exportCSV(false)}
          data-pr-tooltip="CSV"
        >
          Export
        </button>
        <div className={"card"} style={{ height: 600, width: "100%" }}>
          <DataTable
            value={rooms}
            paginator
            rows={5}
            ref={dt}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              field="_id"
              header="_id"
              filter
              filterPlaceholder="Search"
              style={{ width: "6rem" }}
            ></Column>
            <Column
              field="full_name"
              header="full_name"
              filter
              filterPlaceholder="Search"
              style={{ width: "6rem" }}
            ></Column>
            <Column
              field="registrationNo"
              header="Reg No."
              filter
              filterPlaceholder="Search"
              style={{ width: "8rem" }}
            ></Column>
            <Column
              field="check_in"
              header="Checked In"
              style={{ width: "10%" }}
            ></Column>
            <Column
              field="check_out"
              header="Expected Checkout"
              style={{ width: "10%" }}
            ></Column>
            <Column
              field="verifiedby"
              header="Verfied By"
              style={{ width: "5%" }}
            ></Column>
            <Column
              field="remark"
              header="Reamrk"
              style={{ width: "5%" }}
            ></Column>
            <Column
              field="Ram"
              header="Entry Status"
              body={statusBodyTemplate}
              style={{ width: "10%" }}
            ></Column>
            <Column
              field="databasePkey"
              header="Booking Status"
              body={Booking_status}
            ></Column>
            <Column field="createdAt" header="Created At"></Column>
            <Column
              field="#"
              header="Action"
              body={Action}
              style={{ width: "15%" }}
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
