"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Course = {
  id: string;
  code: string;
  name: string;
  faculty: string;
  department: string;
  programme: string;
  awardType: string;
  yearGroup: string;
  isActive: boolean;
};

type Lecturer = {
  id: string;
  name: string;
  email: string;
};

type Offering = {
  id: string;
  academicYear: string;
  semester: string;
  status: string;
  course: Course;
  lecturer: Lecturer;
  group: {
    id: string | null;
    title: string | null;
    memberCount: number;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4001";

async function request<T>(path: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...options?.headers,
    },
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data as T;
}

export function AdminCourseAssignments() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const firstCourse = courses[0]?.id ?? "";
  const firstLecturer = lecturers[0]?.id ?? "";

  const load = async () => {
    const [courseData, offeringData, lecturerData] = await Promise.all([
      request<{ courses: Course[] }>("/admin/courses"),
      request<{ offerings: Offering[] }>("/admin/course-offerings"),
      request<{ users: Lecturer[] }>("/admin/users?role=lecturer"),
    ]);

    setCourses(courseData.courses);
    setOfferings(offeringData.offerings);
    setLecturers(lecturerData.users);
  };

  useEffect(() => {
    load().catch((error) =>
      setMessage(error instanceof Error ? error.message : "Unable to load courses"),
    );
  }, []);

  const activeOfferings = useMemo(
    () => offerings.filter((offering) => offering.status === "active"),
    [offerings],
  );

  const createCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      await request("/admin/courses", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      event.currentTarget.reset();
      await load();
      setMessage("Course created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create course");
    } finally {
      setSaving(false);
    }
  };

  const assignCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      await request("/admin/course-offerings", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await load();
      setMessage("Course assigned and group chat created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to assign course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="course-admin" id="courses">
      <section className="section-header">
        <div>
          <p className="eyebrow">Academic Setup</p>
          <h2>Courses & Assignments</h2>
        </div>
        <span className="count-label">{activeOfferings.length} active groups</span>
      </section>

      {message ? <p className="form-message">{message}</p> : null}

      <section className="two-column">
        <form className="panel form-panel" onSubmit={createCourse}>
          <h3>Create Custom Course</h3>
          <div className="form-grid">
            <input name="code" placeholder="Course code e.g. CS205" required />
            <input name="name" placeholder="Course name" required />
            <input name="faculty" placeholder="Faculty" required />
            <input name="department" placeholder="Department" required />
            <input name="programme" placeholder="Programme" required />
            <select name="awardType" defaultValue="HND">
              <option>HND</option>
              <option>BTech</option>
            </select>
            <select name="yearGroup" defaultValue="Level 100">
              <option>Level 100</option>
              <option>Level 200</option>
              <option>Level 300</option>
              <option>Level 400</option>
            </select>
            <input name="creditHours" placeholder="Credit hours" type="number" min="0" />
          </div>
          <textarea name="description" placeholder="Course description" />
          <button disabled={saving} type="submit">
            Create Course
          </button>
        </form>

        <form className="panel form-panel" onSubmit={assignCourse}>
          <h3>Assign Course</h3>
          <div className="form-grid">
            <input name="academicYear" placeholder="2026/2027" required />
            <select name="semester" defaultValue="Semester 1">
              <option>Semester 1</option>
              <option>Semester 2</option>
            </select>
            <select name="courseId" defaultValue={firstCourse} required>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
            <select name="lecturerId" defaultValue={firstLecturer} required>
              {lecturers.map((lecturer) => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.name}
                </option>
              ))}
            </select>
          </div>
          <button disabled={saving || !firstCourse || !firstLecturer} type="submit">
            Assign & Create Group
          </button>
        </form>
      </section>

      <section className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Academic Year</th>
              <th>Semester</th>
              <th>Course</th>
              <th>Lecturer</th>
              <th>Group</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {offerings.map((offering) => (
              <tr key={offering.id}>
                <td>{offering.academicYear}</td>
                <td>{offering.semester}</td>
                <td>
                  <strong>{offering.course.code}</strong>
                  <span>{offering.course.name}</span>
                </td>
                <td>
                  <strong>{offering.lecturer.name}</strong>
                  <span>{offering.lecturer.email}</span>
                </td>
                <td>{offering.group.memberCount} members</td>
                <td>{offering.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}
