import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const cachedDarkMode = localStorage.getItem("darkMode");
    return cachedDarkMode ? JSON.parse(cachedDarkMode) : true;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.style.filter = "invert(100%) hue-rotate(180deg)";
      document.body.style.backgroundColor = "#111";
      var mediaElementsDark = document.querySelectorAll("img, video, iframe");
      mediaElementsDark.forEach(function (element) {
        element.style.filter = "invert(100%) hue-rotate(180deg)";
      });
      var iconElementsDark = document.querySelectorAll(".icon");
      iconElementsDark.forEach(function (element) {
        element.style.filter = "invert(15%) hue-rotate(180deg)";
      });
      var preElementsDark = document.querySelectorAll("pre");
      preElementsDark.forEach(function (element) {
        element.style.filter = "invert(6%)";
      });
      var liMarkersDark = document.querySelectorAll("li::marker");
      liMarkersDark.forEach(function (marker) {
        marker.style.color = "#666";
      });
    } else {
      document.body.style.filter = "invert(0%) hue-rotate(0deg)";
      document.body.style.backgroundColor = "white";
      var mediaElementsLight = document.querySelectorAll("img, video, iframe");
      mediaElementsLight.forEach(function (element) {
        element.style.filter = "invert(0%) hue-rotate(0deg)";
      });
      var iconElementsLight = document.querySelectorAll(".icon");
      iconElementsLight.forEach(function (element) {
        element.style.filter = "invert(0%) hue-rotate(0deg)";
      });
      var preElementsLight = document.querySelectorAll("pre");
      preElementsLight.forEach(function (element) {
        element.style.filter = "invert(0%)";
      });
      var liMarkersLight = document.querySelectorAll("li::marker");
      liMarkersLight.forEach(function (marker) {
        marker.style.color = "#1212";
      });
    }
  }, [darkMode]);

  const [entryTime, setEntryTime] = useState({
    hours: "09",
    minutes: "00",
    period: "AM",
  });
  const [exitTime, setExitTime] = useState({
    hours: "12",
    minutes: "00",
    period: "PM",
  });
  const [breakDuration, setBreakDuration] = useState(0);
  const [targetDuration, setTargetDuration] = useState({
    hours: "10",
    minutes: "00",
  });
  const [remainingDuration, setRemainingDuration] = useState({
    hours: "07",
    minutes: "00",
  });

  useEffect(() => {}, [remainingDuration]);

  const [wfhStartTime, setWfhStartTime] = useState({
    hours: "12",
    minutes: "00",
    period: "PM",
  });

  const [wfhEndTime, setWfhEndTime] = useState({
    hours: "07",
    minutes: "00",
    period: "PM",
  });

  const [isChecked, setIsChecked] = useState(true);

  const handleSwitchChange = () => {
    setIsChecked(!isChecked);
    if (isChecked) {
    }
  };

  const handleWfhStartTime = (wfhStartTime) => {
    setWfhStartTime({
      hours: String(formatHours(wfhStartTime.getHours())).padStart(2, "0"),
      minutes: String(formatMinutes(wfhStartTime.getMinutes())).padStart(
        2,
        "0"
      ),
      period: getAmPm(wfhStartTime.getHours()),
    });
  };

  const handleWfhEndTime = (wfhEndTime) => {
    setWfhEndTime({
      hours: String(formatHours(wfhEndTime.getHours())).padStart(2, "0"),
      minutes: String(formatMinutes(wfhEndTime.getMinutes())).padStart(2, "0"),
      period: getAmPm(wfhEndTime.getHours()),
    });
  };

  const formatHours = (hours) => {
    if (hours > 12) {
      return hours - 12;
    }
    return hours;
  };

  const formatMinutes = (minutes) => {
    var num = Number(minutes).toFixed(0);
    if (num % 10 === num) {
      return "0" + num.toString();
    }
    return num;
  };

  const getAmPm = (hours) => {
    if (hours >= 12) return "PM";
    return "AM";
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleEntryTimeChange = (time) => {
    setEntryTime(time);
  };

  const handleExitTimeChange = (time) => {
    setExitTime(time);
  };

  const handleTargetDuration = (duration) => {
    setTargetDuration(duration);
  };

  const handleRemainingDuration = (duration) => {
    console.log(duration);
    var hours = Math.floor(duration / 60);
    var minutes = duration%60;
    var data = {
      hours: String(formatHours(hours)).padStart(2, "0"),
      minutes: String(formatMinutes(minutes)).padStart(2, "0"),
    };
    setRemainingDuration(data);
    return data;
  };

  const handleBreakDuration = (duration) => {
    setBreakDuration(duration);
  };

  const addrandomBreak = () => {
    return Math.floor(Math.random() * (90 - 50 + 1)) + 50;
  };

  const convertTo24HourFormat = (time) => {
    let hours = parseInt(time.hours, 10);
    if (time.period === "PM" && hours < 12) {
      hours += 12;
    }
    return `${hours.toString().padStart(2, "0")}:${time.minutes}:00`;
  };

  const calculateTimeFrame = () => {
    const entryTimeString = convertTo24HourFormat(entryTime);
    const exitTimeString = convertTo24HourFormat(exitTime);
    const entryTimeObj = new Date(`2024-03-20T${entryTimeString}`);
    const exitTimeObj = new Date(`2024-03-20T${exitTimeString}`);
    const brkDuration = isChecked ? addrandomBreak() : breakDuration;
    handleBreakDuration(brkDuration);
    const totalInOfficeDuration =
      (exitTimeObj.getTime() - entryTimeObj.getTime()) / (1000 * 60);
    var remainingDur =
      Number(targetDuration.hours) * 60 +
      Number(targetDuration.minutes) -
      Number(totalInOfficeDuration);
    var remainingDuration = handleRemainingDuration(remainingDur);
    const startTime = new Date(exitTimeObj.getTime() + brkDuration * 60000);
    const endTime = new Date(
      startTime.getTime() +
        remainingDuration.hours * 60 * 60 * 1000 +
        remainingDuration.minutes * 60 * 1000
    );
    handleWfhStartTime(startTime);
    handleWfhEndTime(endTime);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTimeFrame();
  };

  return (
    <Container fluid className={"py-4"}>
      <Row className="justify-content-between align-items-center mb-4">
        <Col className="text-center">
          <h1 className="mb-0">Work Time Calculator</h1>
        </Col>
        <Col className="col-auto">
          <ToggleButtonGroup type="button" className="mb-2">
            <ToggleButton variant="outline-primary" onClick={toggleDarkMode}>
              {!darkMode ? (
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="toggleIcon_oIOL lightToggleIcon_SFTY"
                >
                  <path
                    fill="currentColor"
                    d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"
                  ></path>
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="toggleIcon_oIOL darkToggleIcon_ekgs"
                >
                  <path
                    fill="currentColor"
                    d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"
                  ></path>
                </svg>
              )}
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Entry Time</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    as="select"
                    value={entryTime.hours}
                    onChange={(e) =>
                      handleEntryTimeChange({
                        ...entryTime,
                        hours: e.target.value,
                      })
                    }
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Control
                    as="select"
                    value={entryTime.minutes}
                    onChange={(e) =>
                      handleEntryTimeChange({
                        ...entryTime,
                        minutes: e.target.value,
                      })
                    }
                  >
                    {[...Array(60)].map((_, i) => (
                      <option key={i} value={String(i).padStart(2, "0")}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Control
                    as="select"
                    value={entryTime.period}
                    onChange={(e) =>
                      handleEntryTimeChange({
                        ...entryTime,
                        period: e.target.value,
                      })
                    }
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </Form.Control>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Exit Time</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    as="select"
                    value={exitTime.hours}
                    onChange={(e) =>
                      handleExitTimeChange({
                        ...exitTime,
                        hours: e.target.value,
                      })
                    }
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Control
                    as="select"
                    value={exitTime.minutes}
                    onChange={(e) =>
                      handleExitTimeChange({
                        ...exitTime,
                        minutes: e.target.value,
                      })
                    }
                  >
                    {[...Array(60)].map((_, i) => (
                      <option key={i} value={String(i).padStart(2, "0")}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Control
                    as="select"
                    value={exitTime.period}
                    onChange={(e) =>
                      handleExitTimeChange({
                        ...exitTime,
                        period: e.target.value,
                      })
                    }
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </Form.Control>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Working Hours</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    as="select"
                    value={targetDuration.hours}
                    onChange={(e) =>
                      handleTargetDuration({
                        ...targetDuration,
                        hours: e.target.value,
                      })
                    }
                  >
                    {[...Array(24)].map((_, i) => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Control
                    as="select"
                    value={targetDuration.minutes}
                    onChange={(e) =>
                      handleTargetDuration({
                        ...targetDuration,
                        minutes: e.target.value,
                      })
                    }
                  >
                    {[...Array(60)].map((_, i) => (
                      <option key={i} value={String(i).padStart(2, "0")}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col>
                  <p style={{ margin: "0 0 0.5em 0" }}></p>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Random Break Hour"
                    checked={isChecked}
                    onChange={handleSwitchChange}
                  />
                </Col>
                {!isChecked && (
                  <Col>
                    <p style={{ margin: "0 0 0.5em 0" }}>
                      Total Break Time (in Minutes)
                    </p>
                    <Form.Control
                      as="input"
                      value={breakDuration}
                      onChange={(e) => handleBreakDuration(e.target.value)}
                    ></Form.Control>
                  </Col>
                )}
              </Row>
            </Form.Group>
            <Button variant="primary" type="submit">
              Calculate
            </Button>
          </Form>
        </Col>
      </Row>
      <div>
        <Row className="justify-content-between align-items-center mb-4">
          <Col className="text-center">
            <h2 className="mb-0">Result</h2>
          </Col>
        </Row>
        <Row className="justify-content-between align-items-center mb-4">
          <Col className="text-center">
            <p className="mb-0">
              Entry Time: {entryTime.hours}:{entryTime.minutes}{" "}
              {entryTime.period}
            </p>
          </Col>
        </Row>
        <Row className="justify-content-between align-items-center mb-4">
          <Col className="text-center">
            <p className="mb-0">
              Exit Time: {exitTime.hours}:{exitTime.minutes} {exitTime.period}
            </p>
          </Col>
        </Row>
        <Row className="justify-content-between align-items-center mb-4">
          <Col className="text-center">
            <p className="mb-0">
              Break Duration: {Number(breakDuration).toFixed(0)} minutes
            </p>
          </Col>
        </Row>
        <Row className="justify-content-between align-items-center mb-4">
          <Col className="text-center">
            <p className="mb-0 fw-bold badge bg-info text-wrap">
              New WFH Hours: {wfhStartTime.hours}:{wfhStartTime.minutes}{" "}
              {wfhStartTime.period} to {wfhEndTime.hours}:{wfhEndTime.minutes}{" "}
              {wfhEndTime.period}
            </p>
          </Col>
        </Row>
        <Row className="justify-content-between align-items-center mb-4">
          <Col className="text-center">
            {Number(remainingDuration.hours) <= 1 &&
            Number(remainingDuration.minutes) === 0 ? (
              <p className="mb-0">
                WFH Duration: {Number(remainingDuration.hours).toFixed(0)} hour
              </p>
            ) : Number(remainingDuration.hours) <= 1 &&
              Number(remainingDuration.minutes) === 1 ? (
              <p className="mb-0">
                WFH Duration: {Number(remainingDuration.hours).toFixed(0)} hour{" "}
                {Number(remainingDuration.minutes).toFixed(0)} minute
              </p>
            ) : Number(remainingDuration.hours) > 1 &&
              Number(remainingDuration.minutes) === 0 ? (
              <p className="mb-0">
                WFH Duration: {Number(remainingDuration.hours).toFixed(0)} hours{" "}
              </p>
            ) : Number(remainingDuration.hours) > 1 &&
              Number(remainingDuration.minutes) === 1 ? (
              <p className="mb-0">
                WFH Duration: {Number(remainingDuration.hours).toFixed(0)} hours{" "}
                {Number(remainingDuration.minutes).toFixed(0)} minute
              </p>
            ) : (
              <p className="mb-0">
                WFH Duration: {Number(remainingDuration.hours).toFixed(0)} hours{" "}
                {Number(remainingDuration.minutes).toFixed(0)} minutes
              </p>
            )}
          </Col>
        </Row>
        <Row className="justify-content-between align-items-center mb-4">
          <Col className="text-center">
            {Number(targetDuration.hours) <= 1 &&
            Number(targetDuration.minutes) === 0 ? (
              <p className="mb-0">
                Total Working Duration:{" "}
                {Number(targetDuration.hours).toFixed(0)} hour
              </p>
            ) : Number(targetDuration.hours) <= 1 &&
              Number(targetDuration.minutes) === 1 ? (
              <p className="mb-0">
                Total Working Duration:{" "}
                {Number(targetDuration.hours).toFixed(0)} hour{" "}
                {Number(targetDuration.minutes).toFixed(0)} minute
              </p>
            ) : Number(targetDuration.hours) > 1 &&
              Number(targetDuration.minutes) === 0 ? (
              <p className="mb-0">
                Total Working Duration:{" "}
                {Number(targetDuration.hours).toFixed(0)} hours{" "}
              </p>
            ) : Number(targetDuration.hours) > 1 &&
              Number(targetDuration.minutes) === 1 ? (
              <p className="mb-0">
                Total Working Duration:{" "}
                {Number(targetDuration.hours).toFixed(0)} hours{" "}
                {Number(targetDuration.minutes).toFixed(0)} minute
              </p>
            ) : (
              <p className="mb-0">
                Total Working Duration:{" "}
                {Number(targetDuration.hours).toFixed(0)} hours{" "}
                {Number(targetDuration.minutes).toFixed(0)} minutes
              </p>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default App;
