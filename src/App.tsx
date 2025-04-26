import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from "react-router";
import { PageWrapper } from './components/motion/PageWrapper'
import { lazy } from "react";
import { StudentRegistrationForm } from './pages/entity/user-register/student-registration-form'

const AuthLayout = lazy(() => import("./components/auth/AuthLayout"));
const AccountSetup = lazy(() => import("./pages/entity/AccountSetup"));
const Dashboard = lazy(() => import("./pages/protected/dashboard"));
const Events = lazy(() => import("./pages/protected/event"));
const Index = lazy(() => import("./pages"));
// const NotFound = lazy(() => import("./pages/error/404"));
// const Placement = lazy(() => import("./pages/placement/placement"));
const ProfileSetup = lazy(() => import("./pages/entity/ProfileSetup"));
const Settings = lazy(() => import("./pages/protected/settings"));
const SideMenuLayout = lazy(() => import("./pages/layout"));
const Student = lazy(() => import("./pages/protected/students/student"));
// const Training = lazy(() => import("./pages/training/training"));


const Page = ({ element: Element }: { element: React.ElementType }) => (
  <PageWrapper>
    <Element />
  </PageWrapper>
);

function App() {
  const location = useLocation();
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {"/* Root routes */"}
          <Route path="/" element={<Page element={Index} />} />

          {"/* Entity Setup routes */"}
          <Route path="/account-setup" element={<Page element={AccountSetup} />} />
          {"/* Authorized users can only access these routes */"}
          <Route element={<AuthLayout />}>
            <Route path="/profile-setup" element={<Page element={ProfileSetup} />} />

            <Route element={<SideMenuLayout />}>
              <Route path="/dashboard" element={<Page element={Dashboard} />} />
              <Route path="/students" element={<Page element={Student} />} />
              {/* <Route path="/placement-drive" element={<Page element={Placement} />} /> */}
              {/* <Route path="/training-module" element={<Page element={Training} />} /> */}
              <Route path="/events" element={<Page element={Events} />} />
              <Route path="/student" element={<Page element={StudentRegistrationForm} />} />

              <Route path="/settings" element={<Page element={Settings} />} />
              <Route path="/students/:id" element={<Page element={Student} />} />
            </Route>
          </Route>

          {"/* 404 route */"}
          {/* <Route path="*" element={<Page element={NotFound} />} /> */}
        </Routes>

      </AnimatePresence>
    </>
  )
}

export default App
