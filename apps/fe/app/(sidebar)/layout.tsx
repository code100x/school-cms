"use client"
import { CourseToggle } from "../../components/CourseToggle";
import Sidebar from "../../components/Sidebar";
import { useCourse, useCourses } from "../../hooks/course";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const {loading, setSelectedCourse, selectedCourse} = useCourse()
  const {courses} = useCourses()

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center gap-2 px-2">
          <div className="h-7 w-7 rounded-lg bg-brand-600" />
          <CourseToggle loading={loading} setSelectedCourse={setSelectedCourse} selectedCourse={selectedCourse} courses={courses} />
        </div>
        <Sidebar courseId={selectedCourse?.id ?? ""} />
      </aside>
      <main className="p-6">{children}</main>
    </div>  
  );
}
