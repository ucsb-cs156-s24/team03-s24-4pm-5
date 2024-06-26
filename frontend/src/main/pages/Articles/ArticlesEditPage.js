import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ArticlesEditPage({storybook=false}) {
  let { id } = useParams();

  const { data: articles, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/Articles?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/Articles`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (articles) => ({
    url: "/api/Articles",
    method: "PUT",
    params: {
      id: articles.id,
    },
    data: {
      title: articles.title,
      url: articles.url,
      explanation: articles.explanation,
      email: articles.email,
      dateAdded: articles.dateAdded
    }
  });

  const onSuccess = (articles) => {
    toast(`Article Updated - id: ${articles.id} title: ${articles.title}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/Articles?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/Articles" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Article</h1>
        {
          articles && <ArticlesForm initialContents={articles} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

