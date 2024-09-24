module selmi::selmi {
    use std::signer;
    use std::vector;
    use std::debug;
    use std::string::{Self, String, utf8};
    use aptos_framework::event;
    use std::option;
    use aptos_token_objects::collection::{Self};
    use aptos_framework::object;
    use aptos_token_objects::token::{Self, Token};
    use aptos_std::smart_vector;

    // Errors

    const GENERIC_ERROR: u64 = 1;

    // STATUSES
    // "OPEN" [Listings]
    // "ACTIVE" [Listings, Offer, CompanyOffer]
    // "REJECTED" [Listings, Offer, CompanyOffer]
    // "ACCEPTED" [Listings, Offer, CompanyOffer]
    // "INACTIVE" [Listings]

    // Structs

    struct Listing has copy, store, key {
        price: u64,
        description: String,
        status: String,
        documents: vector<Document>,
        photos: vector<String>,
        offers: vector<Offer>,
        estimates: vector<Estimation>,
        ai_estimates: vector<AiEstimation>,
        legal_offers: vector<CompanyOffer>,
        legal_operator: address
    }

    struct Listings has key {
        listings: smart_vector::SmartVector<Listing>,
    }

    struct Companies has key {
        addresses: smart_vector::SmartVector<address>
    }

    struct Document has store, copy {
        description: String,
        link: String
    }

    struct Company has key, copy, store {
        description: String,
        documents: vector<Document>,
        reviews: vector<Review>
    }

    struct Offer has copy, store {
        description: String,
        status: String,
        price: u64
    }

    struct Estimation has copy, store{
        company: address,
        price: u64,
        description: String,
        attached_documents: vector<Document>
    }

    struct AiEstimation has copy, store {
        ai_name: String,
        input: String,
        result: String
    }

    struct Review has store, copy {
        description: String,
        rating: u64
    }

    struct CompanyOffer has copy, store {
        name: address,
        status: String,
        price: u64
    }

    struct ListingOwners has key {
        addresses: smart_vector::SmartVector<address>
    }

    fun init_module(deployer: &signer) {
        move_to(deployer, ListingOwners {
            addresses: smart_vector::new(),
        });

        move_to(deployer, Companies {
            addresses: smart_vector::new(),
        });
    }

    public entry fun create_listing(user: &signer, price: u64, description: String) acquires ListingOwners, Listings {
        let listing_owners = borrow_global_mut<ListingOwners>(@selmi);
        let user_address = signer::address_of(user);

        if (!smart_vector::contains(&listing_owners.addresses, &signer::address_of(user))) {
            smart_vector::push_back(&mut listing_owners.addresses, signer::address_of(user));
        };

        let new_listing = Listing {
            price: price,
            description: description,
            status: utf8(b"OPEN"),
            offers: vector::empty(),
            estimates: vector::empty(),
            ai_estimates: vector::empty(),
            legal_offers: vector::empty(),
            documents: vector::empty(),
            legal_operator: user_address,
            photos: vector::empty(),
        };

        if (!exists<Listings>(user_address)) {
            move_to(user, Listings {
                listings: smart_vector::new(),
            });
        };

        let listings = borrow_global_mut<Listings>(user_address);

        smart_vector::push_back(&mut listings.listings, new_listing);
    }

    public entry fun create_company(company: &signer, description: String) acquires Companies {
        let new_company = Company {
            description: description,
            documents: vector::empty<Document>(),
            reviews: vector::empty<Review>()
        };

        move_to(company, new_company);

        let companies = borrow_global_mut<Companies>(@selmi);
        if (!smart_vector::contains(&companies.addresses, &signer::address_of(company))) {
            smart_vector::push_back(&mut companies.addresses, signer::address_of(company));
        };
    }

    public entry fun add_review(user: &signer, company: address, description: String, rating: u64) acquires Company {
        let review = Review { description: description, rating: rating };
        let company_ref = borrow_global_mut<Company>(company);

        vector::push_back(&mut company_ref.reviews, review);
    }

    public entry fun add_estimate(user: &signer, seller: address, index: u64, price: u64, description: String) acquires Listings { //, attached_documents: vector<String>)  {
        let listings = borrow_global_mut<Listings>(seller);
        let listing = smart_vector::borrow_mut(&mut listings.listings, index);

        let user_address = signer::address_of(user);
        //let company = borrow_global<Company>(user_address);

        let estimation = Estimation {
            company: user_address,
            price: price,
            description: description,
            attached_documents: vector::empty()
        };

        vector::push_back(&mut listing.estimates, estimation);
    }

    public entry fun add_ai_estimate(user: &signer, seller: address, index: u64, price: u64, name: String, input: String, result: String) acquires Listings {
        let listings = borrow_global_mut<Listings>(seller);
        let listing = smart_vector::borrow_mut(&mut listings.listings, index);

        let ai_estimation = AiEstimation {
            ai_name: name,
            input: input,
            result: result,
        };

        vector::push_back(&mut listing.ai_estimates, ai_estimation);
    }

    public entry fun add_offer(user: &signer, seller: address, index: u64, description: String, price: u64) acquires Listings {
        let new_offer = Offer { description: description, status: utf8(b"OPEN"), price: price };

        let listings = borrow_global_mut<Listings>(seller);
        let listing = smart_vector::borrow_mut(&mut listings.listings, index);

        vector::push_back(&mut listing.offers, new_offer);
    }

    public entry fun change_offer_status(user: &signer, index: u64, status: String) acquires Listings {
        let user_address = signer::address_of(user);
        let listings = borrow_global_mut<Listings>(user_address);
        let listing = smart_vector::borrow_mut(&mut listings.listings, index);

        listing.status = status;
    }

    public entry fun add_company_offer(user: &signer, seller: address, index: u64, price: u64) acquires Listings {
        let listings = borrow_global_mut<Listings>(seller);
        let listing = smart_vector::borrow_mut(&mut listings.listings, index);
        let user_address = signer::address_of(user);

        let company_offer = CompanyOffer {
            name: user_address,
            status: utf8(b"ACTIVE"),
            price: price
        };

        vector::push_back(&mut listing.legal_offers, company_offer);
    }

    public entry fun change_company_offer_status(user: &signer, listing_index: u64, company_offer_index: u64, status: String) acquires Listings {
        let user_address = signer::address_of(user);
        let listings = borrow_global_mut<Listings>(user_address);
        let listing = smart_vector::borrow_mut(&mut listings.listings, listing_index);

        let company_offer = vector::borrow_mut(&mut listing.legal_offers, company_offer_index);
        company_offer.status = status;
    }

    public entry fun add_company_review(user: &signer, company: address, description: String, rating: u64) acquires Company {
        let company = borrow_global_mut<Company>(company);

        let new_review = Review {
            description: description,
            rating: rating
        };

        vector::push_back(&mut company.reviews, new_review);
    }

    #[view]
    public fun get_owners_list(): vector<address> acquires ListingOwners {
        if (exists<ListingOwners>(@selmi)) {
            smart_vector::to_vector(&borrow_global<ListingOwners>(@selmi).addresses)
        } else {
            vector[]
        }
    }

    #[view]
    public fun get_user_listings(user: address): vector<Listing> acquires Listings {
        smart_vector::to_vector(&borrow_global<Listings>(user).listings)
    }

    #[view]
    public fun get_company(company: address): Company acquires Company {
        *borrow_global<Company>(company)
    }

    #[view]
    public fun get_companies_list(): vector<address> acquires Companies {
        smart_vector::to_vector(&borrow_global<Companies>(@selmi).addresses)
    }
}
