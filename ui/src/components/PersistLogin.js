

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, setAuth } = useAuth();
  const [persist] = useLocalStorage("persist", false);

  useEffect(() => {
    if (persist) {
      setAuth(JSON.parse(localStorage.getItem("persistAuth")));
    }
    setIsLoading(false);
  }, []);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
};

export default PersistLogin;
