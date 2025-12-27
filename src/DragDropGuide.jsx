import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  X,
  Package,
  Check,
  Copy,
  LayoutTemplate,
  Code2,
  ChevronRight,
  MonitorPlay,
  Database,
  Github,
  Twitter,
  Heart,
} from "lucide-react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UI UTILS ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- UI COMPONENTS ---
const Button = ({ children, onClick, className, variant, size, ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-9 w-9",
    sm: "h-8 rounded-md px-3 text-xs",
  };
  return (
    <button
      className={cn(
        base,
        variants[variant || "default"],
        sizes[size || "default"],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const CodeBlock = ({ code, language = "bash", title }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group rounded-lg overflow-hidden border border-slate-800 bg-slate-950 my-4 shadow-xl">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
          <span className="text-xs font-semibold text-slate-400">{title}</span>
          <span className="text-[10px] text-slate-600 font-mono uppercase">
            {language}
          </span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 text-xs md:text-sm text-slate-300 overflow-x-auto font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} className="text-slate-400" />
          )}
        </button>
      </div>
    </div>
  );
};

const SectionHeader = ({ number, title, icon: Icon, description }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-2">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm shadow-lg ring-4 ring-blue-50">
        {number}
      </span>
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        {title}
      </h2>
    </div>
    <p className="text-slate-500 ml-11">{description}</p>
  </div>
);

// =====***QUAN TRỌNG***=====
// ======TODO: Hoặc import page .jsx của bạn từ folder @pages/Home , @pages/PostDetail....

// --- DEMO PAGES (INTERNAL) ---
const Home = ({ onNavigate }) => (
  <div className="p-4 space-y-3">
    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
      <strong>👋 Demo Home:</strong> Click vào thẻ bên dưới để test chuyển trang
      (Push Route).
    </div>
    {[1, 2, 3].map((id) => (
      <div
        key={id}
        className="group p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all"
        onClick={() => onNavigate("PostDetail", { postId: id })}
      >
        <h4 className="font-bold text-slate-800 group-hover:text-blue-600">
          Bài viết Demo #{id}
        </h4>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <span>Read more</span> <ChevronRight size={12} />
        </div>
      </div>
    ))}
  </div>
);

const Search = ({ onNavigate }) => (
  <div className="p-4 space-y-3">
    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
      <strong>👋 Demo Search:</strong> Click vào thẻ bên dưới để test chuyển
      trang (Push Route).
    </div>
    {[1, 2, 3].map((id) => (
      <div
        key={id}
        className="group p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all"
        onClick={() => onNavigate("SearchDetail", { searchId: id })}
      >
        <h4 className="font-bold text-slate-800 group-hover:text-blue-600">
          Bài viết Search #{id}
        </h4>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <span>Read more</span> <ChevronRight size={12} />
        </div>
      </div>
    ))}
  </div>
);

// ======NOTE: LƯU Ý: Tại component bên ngoài import vào đây, nếu đã có 1 sự kiện navigate khi click vào 1 PostCard / 1 PostDetail hoặc 1 SearchCard,
//  thì phải check để ngăn chặn navigate chuyển URL trước rồi mới gọi onNavigate, ví dụ function PostDetail:

// function PostDetail({
//   onNavigate,
//   state,
// }) {

//   // logic....

//   // const navigate = useNavigate();
//   // const handlePostDetail = () => {
//   //   if (!onNavigate)
//   //     navigate(`/@${user.username}/post/${id}`, {
//   //       state: {
//   //         id,
//   //       },
//   //     });
//   //   onNavigate("PostDetail", { postId: id, isDeck: true });
//   // };

//   // const handleUserProfile = () => {
//   //   if (!onNavigate)
//   //     navigate(`/@${user.username}`, {
//   //       state: {
//   //         userId: user_id,
//   //       },
//   //     });
//   //   onNavigate("UserProfile", { username, isDeck: true });
//   // };

//   // ....logic

//   return (
//     <div className="border-border flex flex-col p-3 md:p-6">

//       {/* use handlePostDetail here with a div/card/component */}

//       {/* use handleUserProfile here with a div/card/component */}

//     </div>
//   );
// }

const PostDetail = ({ onNavigate, state }) => (
  <div className="p-4">
    <div className="mb-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
      ID: {state?.postId}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">Chi tiết bài viết</h3>
    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
      Đây là trang chi tiết. Bạn có thể thấy header của cột đã tự động hiện nút
      Back.
    </p>
    <Button
      size="sm"
      onClick={() =>
        onNavigate("UserProfile", { userId: 99, userName: "Admin" })
      }
      className="w-full bg-indigo-600 hover:bg-indigo-700"
    >
      Xem Profile Tác giả
    </Button>
  </div>
);

const SearchDetail = ({ onNavigate, state }) => (
  <div className="p-4">
    <div className="mb-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
      ID: {state?.searchId}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">Kết quả chi tiết</h3>
    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
      Đây là trang kết quả chi tiết. Bạn có thể thấy header của cột đã tự động
      hiện nút Back.
    </p>
    <Button
      size="sm"
      onClick={() =>
        onNavigate("UserProfile", { userId: 99, userName: "Admin" })
      }
      className="w-full bg-indigo-600 hover:bg-indigo-700"
    >
      Xem Profile Tác giả
    </Button>
  </div>
);

const UserProfile = ({ onNavigate, state }) => (
  <div className="p-6 text-center">
    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">
      {state?.userName?.[0]}
    </div>
    <h3 className="font-bold text-lg">{state?.userName}</h3>
    <p className="text-xs text-slate-500 mb-6">Software Engineer</p>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onNavigate("Home")}
      className="w-full"
    >
      Về trang chủ
    </Button>
  </div>
);

// No influenced
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-8 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
          {/* Social Icons Placeholder */}
          <a href="#" className="text-slate-400 hover:text-slate-500">
            <span className="sr-only">GitHub</span>
            <Github size={20} />
          </a>
          <a href="#" className="text-slate-400 hover:text-slate-500">
            <span className="sr-only">Twitter</span>
            <Twitter size={20} />
          </a>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-sm text-slate-500 flex items-center justify-center md:justify-start gap-1">
            &copy; {currentYear} Made by
            <span className="font-bold text-slate-900">trungdang2309</span>.
          </p>
          <p className="text-center text-xs text-slate-400 mt-2 md:text-left flex items-center justify-center md:justify-start gap-1">
            Made, debugged and inspected with{" "}
            <Heart size={12} className="text-red-500 fill-red-500" /> using dnn
            kit, React & Tailwind.
          </p>
        </div>
      </div>
    </footer>
  );
};

// ====******************************************************************************====
// =====***QUAN TRỌNG***=====
// 1. Nơi khai báo tất cả các page(component) có thể hiện ở trong 1 cột ==> CẦN TÙY CHỈNH
const COMPONENT_REGISTRY = {
  Home,
  PostDetail,
  UserProfile,
  Search,
  SearchDetail,
  // THÊM CÁC COMPONENTS/PAGES KHÁC...
};

// 2. Nơi khai báo tất cả các loại columns mà muốn render ra, ví dụ Home,  Activity, Search, Profile...==> CẦN TÙY CHỈNH
const COLUMN_TYPES = [
  { type: "home", label: "Home Feed", initialComponent: "Home" },
  { type: "profile", label: "My Profile", initialComponent: "UserProfile" },
  { type: "search", label: "Search", initialComponent: "Search" },
  // ...THÊM CÁC LOẠI CỘT KHÁC...
];
// ====******************************************************************************====

// --- CORE: SORTABLE COLUMN ---
const SortableColumn = ({ id, index, navigation, onNavigate, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const current = navigation.history[navigation.currentIndex];
  const CurrentComponent = COMPONENT_REGISTRY[current.componentName];

  return (
    <div
      ref={setNodeRef}
      style={style}
      // UPDATE: Removed "rotate-2" class here
      className={cn(
        "flex flex-col w-[320px] min-w-[320px] h-full overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm transition-all",
        isDragging
          ? "z-50 shadow-2xl ring-2 ring-blue-500 opacity-90"
          : "hover:shadow-md hover:border-slate-300"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100 cursor-grab active:cursor-grabbing"
      >
        <div className="flex gap-1">
          <button
            className="p-1 rounded hover:bg-white disabled:opacity-30"
            disabled={navigation.currentIndex === 0}
            onClick={() => onNavigate(id, "back")}
          >
            ←
          </button>
          <button
            className="p-1 rounded hover:bg-white disabled:opacity-30"
            disabled={navigation.currentIndex === navigation.history.length - 1}
            onClick={() => onNavigate(id, "forward")}
          >
            →
          </button>
        </div>
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {current.componentName}
        </span>
        <button
          onClick={() => onRemove(id)}
          className="p-1 text-slate-400 hover:text-red-500"
        >
          <X size={14} />
        </button>
      </div>
      <SimpleBar className="flex-1 bg-white" style={{ height: "100%" }}>
        {CurrentComponent ? (
          <CurrentComponent
            onNavigate={(name, state) => onNavigate(id, "push", name, state)}
            state={current.state}
          />
        ) : (
          <div className="p-10 text-center text-red-400 text-xs">
            Component Not Found
          </div>
        )}
      </SimpleBar>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function DragDropDashboardDemo() {
  // State chứa các cột khởi tạo
  const [columns, setColumns] = useState([
    {
      id: "col-1",
      type: "home",
      navigation: {
        history: [{ componentName: "Home", state: null }],
        currentIndex: 0,
      },
    },
    {
      id: "col-2",
      type: "profile",
      navigation: {
        history: [
          { componentName: "UserProfile", state: { userName: "Demo User" } },
        ],
        currentIndex: 0,
      },
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddColumn = (type) => {
    const config = COLUMN_TYPES.find((ct) => ct.type === type);
    setColumns([
      ...columns,
      {
        id: `col-${Date.now()}`,
        type,
        navigation: {
          history: [{ componentName: config.initialComponent, state: null }],
          currentIndex: 0,
        },
      },
    ]);
  };

  const handleNavigate = (colId, action, name, state) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id !== colId) return col;
        const nav = col.navigation;
        let newNav = { ...nav };
        if (action === "push") {
          const history = nav.history.slice(0, nav.currentIndex + 1);
          history.push({ componentName: name, state });
          newNav = { history, currentIndex: history.length - 1 };
        } else if (action === "back")
          newNav.currentIndex = Math.max(0, nav.currentIndex - 1);
        else if (action === "forward")
          newNav.currentIndex = Math.min(
            nav.history.length - 1,
            nav.currentIndex + 1
          );
        return { ...col, navigation: newNav };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header Page */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Draggable Columns Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            Giải pháp Dashboard với khả năng kéo thả cột, tích hợp routing nội
            bộ (Stack Navigation) cho từng cột.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-10">
        {/* === SECTION 1: LIVE DEMO === */}
        <section className="mb-16">
          <SectionHeader
            number="1"
            title="Live Demo"
            icon={MonitorPlay}
            description="Trải nghiệm trực tiếp. Bạn có thể kéo thả cột, thêm cột mới và điều hướng bên trong từng cột."
          />

          {/* Demo Container Window */}
          <div className="rounded-xl border border-slate-200 bg-slate-100 shadow-xl overflow-hidden flex flex-col h-[600px] ring-1 ring-slate-900/5">
            {/* Demo Toolbar */}
            <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="ml-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Dashboard Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">
                  Add Column:
                </span>
                {COLUMN_TYPES.map((t) => (
                  <button
                    key={t.type}
                    onClick={() => handleAddColumn(t.type)}
                    className="px-3 py-1 text-xs font-medium border border-slate-200 rounded bg-slate-50 hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                  >
                    + {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Canvas (Horizontal Scroll) */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
              <div className="flex h-full gap-6">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={columns.map((c) => c.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {columns.map((col, index) => (
                      <SortableColumn
                        key={col.id}
                        id={col.id}
                        index={index}
                        navigation={col.navigation}
                        onNavigate={handleNavigate}
                        onRemove={(id) =>
                          setColumns((prev) => prev.filter((c) => c.id !== id))
                        }
                      />
                    ))}
                  </SortableContext>
                </DndContext>
                <div className="w-10 shrink-0" /> {/* Spacer */}
              </div>
            </div>
          </div>
        </section>

        {/* === SECTION 2: INSTALLATION === */}
        <section className="mb-16">
          <SectionHeader
            number="2"
            title="Installation"
            icon={Package}
            description="Cài đặt các thư viện cần thiết để bắt đầu."
          />
          <div className="bg-slate-900 rounded-xl p-1 shadow-2xl ring-1 ring-white/10">
            <CodeBlock
              title="Terminal"
              code={`npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities simplebar-react clsx tailwind-merge lucide-react`}
            />
          </div>
        </section>

        {/* === SECTION 3: DEV INSTRUCTIONS === */}
        <section className="mb-12">
          <SectionHeader
            number="3"
            title="Dev Instructions"
            icon={Code2}
            description="Hướng dẫn chi tiết cách tạo Component cột mới và đăng ký vào hệ thống."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Step A: Props */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <Database className="text-purple-600" size={20} />
                <h3>A. Tạo Page Component</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Mỗi Component hiển thị trong cột sẽ tự động nhận 2 props quan
                trọng:
              </p>
              <ul className="space-y-2 text-sm text-slate-600 ml-1">
                <li className="flex gap-2">
                  <code className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200 font-mono h-fit">
                    state
                  </code>
                  <span>
                    Object chứa dữ liệu được truyền từ trang trước (giống
                    params).
                  </span>
                </li>
                <li className="flex gap-2">
                  <code className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-mono h-fit">
                    onNavigate
                  </code>
                  <span>
                    Function{" "}
                    <code className="text-xs text-slate-500">
                      (componentName, data)
                    </code>{" "}
                    để push trang mới vào stack của cột đó.
                  </span>
                </li>
              </ul>
              <CodeBlock
                language="jsx"
                title="MyCustomPage.jsx"
                code={`const MyCustomPage = ({ onNavigate, state }) => {
                        return (
                          <div className="p-4">
                            <h1>Custom Page</h1>
                            {/* 1. Sử dụng state nhận được */}
                            <p>Data: {state?.someData}</p>
                            
                            {/* 2. Điều hướng sang trang khác */}
                            <button onClick={() => onNavigate("PostDetail", { id: 123 })}>
                              Go Detail
                            </button>
                          </div>
                        );
                      };`}
              />
            </div>

            {/* Step B: Registry */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <LayoutTemplate className="text-green-600" size={20} />
                <h3>B. Đăng ký Component</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Bạn cần map tên Component (string) vào object{" "}
                <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">
                  COMPONENT_REGISTRY
                </code>{" "}
                để hệ thống có thể render động.
              </p>
              <CodeBlock
                language="javascript"
                title="Dashboard.jsx"
                code={`// Trong file Dashboard chính
                      import MyCustomPage from './MyCustomPage';

                      // 1. Map tên (string) vào component
                      const COMPONENT_REGISTRY = {
                        Home,
                        PostDetail,
                        UserProfile,
                        "MyCustomPage": MyCustomPage // <--- Thêm dòng này
                      };

                      // 2. Thêm vào menu Add Column
                      const COLUMN_TYPES = [
                        // ...
                        { type: "custom", label: "Custom Tab", initialComponent: "MyCustomPage" },
                      ];`}
              />

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md mt-4">
                <p className="text-xs font-medium text-yellow-800 uppercase mb-1">
                  Lưu ý quan trọng
                </p>
                <p className="text-sm text-yellow-700">
                  Bạn không cần xử lý nút Back/Forward. Component cha{" "}
                  <code>SortableColumn</code> đã tự động quản lý history stack.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
