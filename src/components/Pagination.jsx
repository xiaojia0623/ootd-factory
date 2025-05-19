
const Pagination = ({ pagination = {}, changePage }) => {
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${!pagination.has_pre ? 'disabled' : ''}`}>
          <a
            className="page-link"
            href="/"
            aria-label="Previous"
            onClick={(e) => {
              e.preventDefault();
              if (pagination.has_pre) changePage(pagination.current_page - 1);
            }}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        {[...new Array(pagination.total_pages)].map((_, i) => {
          const page = i + 1;
          const isActive = page === pagination.current_page;

          return (
            <li
              className={`page-item ${isActive ? 'active' : ''}`}
              key={`${page}_page`}
            >
              <a
                className="page-link"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  changePage(page);
                }}
              >
                {page}
              </a>
            </li>
          );
        })}

        <li className={`page-item ${!pagination.has_next ? 'disabled' : ''}`}>
          <a
            className="page-link"
            href="/"
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              if (pagination.has_next) changePage(pagination.current_page + 1);
            }}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination