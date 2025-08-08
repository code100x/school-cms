"use client"
import { Course, useCourse, useCourses } from "../hooks/course"

export function CourseToggle({ loading, setSelectedCourse, selectedCourse, courses }: { loading: boolean, setSelectedCourse: (course: string) => void, selectedCourse: Course, courses: Course[] }) {

    if (loading) return <div>Loading...</div>

    return (
        <div>
            <select value={selectedCourse?.id} onChange={(e) => setSelectedCourse(e.target.value)}>
                {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                        {course.title}
                    </option>
                ))}
            </select>
        </div>
    )
    
}