import { useState, useEffect } from 'react';
import customersAPI from '../services/customersAPI';
import Pagination from '../components/Pagination';

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([])

    // pour la pagination
    const [currentPage, setCurrentPage] = useState(1)

    // pour le filtre
    const [search, setSearch] = useState("")

    const fetchCustomers = async () => {
        try{
            const data = await customersAPI.findAll()
            setCustomers(data)
        }catch(error){
            console.log(error.response)
        }
    }

    useEffect(()=>{
       fetchCustomers()
    },[])

    const handleDelete = async (id) => {

        // pessimist on copie en cas d'erreur
        const originalCustomer = [...customers]
        // optimiste
        setCustomers(customers.filter(customer => customer.id !== id))

        // faire le chngement dans la bdd
        try{
            await customersAPI.delete(id)
        }catch(error){
            setCustomers(originalCustomer)
            // si jamais la promesse ne fonctionne pas je remet le "non-supprimé"
        }
    }

    // pour le filtre, ! pas de query selector à ces endroits ci
    const handleSearch = event =>{
        const value = event.currentTarget.value
        setSearch(value)
        setCurrentPage(1)
    }

    const filteredCustomers = customers.filter(c =>
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    )

     // pour la pagination

    const handlePageChange = (page)=>{
        setCurrentPage(page)
    }

    const itemsPerPage = 10
    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage)
    return ( 
        <>
            <h1>Liste des clients</h1>
            {/* filtre */}
            <div className="form-group">
                <input type="text" className='form-control' placeholder='rechercher...' value={search} onChange={handleSearch}/>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className='text-center'>Factures</th>
                        <th className='text-center'>Montant total</th>
                        <th className='text-center'>Montant restant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.firstName} {customer.lastName}</td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className='text-center'>
                                <span className="badge bg-primary badge-primary">
                                    {customer.invoices.length}
                                </span>
                            </td>
                            <td className='text-center'>{customer.totalAmount.toLocaleString()}€</td>
                            <td className='text-center'>{customer.unpaidAmount.toLocaleString()}€</td>
                            <td>
                                <button disabled={customer.invoices.length > 0} className="btn btn-sm btn-danger" onClick={() => handleDelete(customer.id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {
                // condition comme ça si je n'ai pas de résultat de ma recherche je n'affiche pas la pagination en js
                itemsPerPage < filteredCustomers.length &&
                <Pagination 
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredCustomers.length}
                    onPageChanged={handlePageChange}
                />
            }
        </>
     );
}
 
export default CustomersPage;