import { useDispatch, useSelector } from "react-redux";
import { InputSelect } from "../../../components/InputSelect";
import { useState } from "react";
import {
  clearTransactions,
  fetchTransactions,
  transactionConfirm,
  transactionDelete,
} from "../../../rtk/slices/transactionsSlice";
import { apis } from "../../../components/URLs";

export const ReserveBooks = () => {
  const transactions = useSelector((state) => state.transactions);
  console.log(transactions);

  const [reload, setReload] = useState(0);
  const [state, setState] = useState("");

  const dispatch = useDispatch();

  const handlerOnChange = (e) => {
    let value = e.target.value;
    setState(value);
    if (value !== "") {
      console.log(value);
      dispatch(clearTransactions());
      dispatch(
        fetchTransactions(
          apis.Librarian.Book.Transaction.Reserve.FilterByStatus.replace(
            ":number",
            1
          ).replace(":status", value)
        )
      );
    }
  };

  const handlerConfirm = (id) => {
    dispatch(
      transactionConfirm(
        apis.Librarian.Book.Transaction.Reserve.Confirm.replace(":id", id)
      )
    );
  };

  const handlerDelete = (id) => {
    dispatch(
      transactionDelete(
        apis.Librarian.Book.Transaction.Reserve.Delete.replace(":id", id)
      )
    );

    setReload(1);
  };

  const next_page = () => {
    let number;
    if (transactions?.data?.length > 0) {
      number = transactions?.page + 1 - reload;
      dispatch(clearTransactions());
      dispatch(
        fetchTransactions(
          apis.Librarian.Book.Transaction.Reserve.FilterByStatus.replace(
            ":number",
            number
          ).replace(":status", state)
        )
      );
      setReload(0);
    }
    console.log(number);
  };

  const previous_page = () => {
    let number;
    if (transactions?.page > 1) {
      number = transactions?.page - 1;
      dispatch(clearTransactions());
      dispatch(
        fetchTransactions(
          apis.Librarian.Book.Transaction.Reserve.FilterByStatus.replace(
            ":number",
            number
          ).replace(":status", state)
        )
      );
      setReload(0);
    }
    console.log(number);
  };

  //Pending - Confirmed - Expired
  return (
    <>
      <InputSelect
        elements={[
          { value: "", label: "Select The State" },
          { value: "Pending", label: "Pending" },
          { value: "Confirmed", label: "Confirmed" },
          { value: "Expired", label: "Expired" },
        ]}
        onChange={handlerOnChange}
      />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">book title</th>
            <th scope="col">username</th>
            <th scope="col">expiry date</th>
            <th scope="col">date</th>
            <th scope="col">operations</th>
          </tr>
        </thead>
        {state != "" && (
          <tbody className="table-group-divider">
            {transactions?.data?.map((transaction, index) => {
              let date_expiry_date = new Date(transaction.expiry_date);
              const formatted_expiry_date = date_expiry_date.toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }
              );

              let date_transaction_date = new Date(transaction.expiry_date);
              const formatted_transaction_date =
                date_transaction_date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });

              return (
                <tr key={`${transaction}-${index}`}>
                  <th scope="row">
                    {index + 1 + (transactions?.page - 1) * 10}
                  </th>
                  <td>{transaction.books.title}</td>
                  <td>{transaction.users.username}</td>
                  <td>{formatted_expiry_date}</td>
                  <td>{formatted_transaction_date}</td>
                  <td>
                    {state == "Pending" && (
                      <button
                        className="btn btn-success m-1"
                        type="button"
                        onClick={(e) => {
                          e.target.parentNode.innerHTML =
                            "<div style='color:#00aa00'>Confirmed</div>";

                          handlerConfirm(transaction.reservation_id);
                        }}
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      className="btn btn-danger m-1"
                      type="button"
                      onClick={(e) => {
                        e.target.parentNode.innerHTML =
                          "<div style='color:#ff0000'>Delete</div>";
                        handlerDelete(transaction.reservation_id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
      <div className="pagination">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            previous_page();
          }}
        >
          Previous
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            next_page();
          }}
        >
          Next
        </button>
      </div>
    </>
  );
};
